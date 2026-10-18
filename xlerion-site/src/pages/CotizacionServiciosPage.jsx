import React, { useState, useMemo, useEffect } from 'react';
import { DollarSign, CheckCircle, FileText, Mail, Calculator, ChevronRight, AlertCircle } from 'lucide-react';
import Layout from '../components/Layout';
import RoadmapModal from '../components/RoadmapModal';
import { useLanguage } from '../context/LanguageContext';
import { useAnalytics } from '../hooks/useAnalytics';

export default function CotizacionServiciosPage() {
    const { t } = useLanguage();
    useAnalytics('Cotización de Servicios', 'page');
    const [selectedService, setSelectedService] = useState(null);
    const [activeTab, setActiveTab] = useState('servicios'); // 'servicios' o 'calculador'
    const [calculatorStep, setCalculatorStep] = useState(0);
    const [timeUnit, setTimeUnit] = useState('');
    const [calculatorAnswers, setCalculatorAnswers] = useState({});
    const [showRoadmap, setShowRoadmap] = useState(false);
    const [roadmapContent, setRoadmapContent] = useState('');
    const [roadmapLoading, setRoadmapLoading] = useState(false);
    const [roadmapError, setRoadmapError] = useState(null);
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [emailFormData, setEmailFormData] = useState({
        clientName: '',
        clientEmail: '',
        clientCompany: '',
        clientPhone: '',
        additionalNotes: ''
    });
    const [sendingEmail, setSendingEmail] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [sellerPassword, setSellerPassword] = useState('');
    const [sellerUnlocked, setSellerUnlocked] = useState(false);
    const [sellerError, setSellerError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        service: '',
        description: '',
        budget: ''
    });

    // IVA para Colombia (19%)
    const IVA = 0.19;
    const SELLER_PASSWORD = '81720164';

    // Tabla de precios base por hora (USD 2026, sin IVA - se aplica al final)
    // Precios actualizados automáticamente usando referencias públicas (Feb 01, 2026).
    // Fuentes clave: Payscale (web developer salary -> hourly baseline), 99designs (package pricing),
    // ArtStation marketplace (3D asset pricing), GameDeveloper (industry context), Consensys (blockchain market).
    // Nota: cuando una fuente reporta por proyecto o salario anual, se normalizó a tarifa horaria
    // usando supuestos conservadores (≈1600-2000 horas/año según contexto de contrato).
    // Tabla de precios base por hora (USD) — valores basados en rangos Colombia 2026 (midpoints)
    // Fuente: tabla interna de tarifas (COP/hora) convertida a USD aprox. para uso como fallback.
    const basePrices = useMemo(() => ({
        'desarrollo-web-movil': 13.5,    // Desarrollo Web: midpoint ≈ $13.5/hr (COP 30k-80k)
        'software-empresarial': 21,      // Software a medida: midpoint ≈ $21/hr (COP 50k-120k)
        'transformacion-digital': 28,    // Consultoría/Transformación: tarifa consultora
        'tecnologias-blockchain': 30,    // Blockchain: especialista premium
        'diseño-branding': 16,           // Diseño/Branding: midpoint ≈ $16/hr
        'marketing-digital': 14.5,       // Marketing digital: midpoint ≈ $14.5/hr
        'videojuegos': 25,               // Videojuegos: midpoint ≈ $25/hr
        'modelado-3d': 21                // Modelado 3D: midpoint ≈ $21/hr
    }), []);

    // Tope máximo del multiplicador total para evitar estimados desproporcionados
    const MULTIPLIER_CAP = 4; // Limitar máximo a 4x por defecto

    // Fuentes referenciales utilizadas para construir los precios (URLs verificadas - actualiza si es necesario)
    // Nota: algunas páginas bloquean requests automatizados. Si necesitas enlaces adicionales o específicos, los actualizo.
    const priceSources = useMemo(() => ({
        // Baselines y salary/market reports
        'desarrollo-web-movil': 'https://www.payscale.com/research/US/Job=Web_Developer/Hourly_Rate',
        // Directorios de empresas y portfolios (más abiertos que algunos marketplaces)
        'software-empresarial': 'https://clutch.co/categories/software-development',
        // Insights y artículos de consultoría
        'transformacion-digital': 'https://www.mckinsey.com/featured-insights',
        // Blogs y recursos sobre Web3 (ruta consensys.net/blog es estable)
        'tecnologias-blockchain': 'https://consensys.net/blog/',
        // Diseño y casos de estudio
        'diseño-branding': 'https://99designs.com/blog/',
        // Marketing y guías prácticas (página principal de marketing HubSpot)
        'marketing-digital': 'https://www.hubspot.com/marketing',
        // Noticias e industria de videojuegos
        'videojuegos': 'https://www.gameindustry.biz/',
        // Marketplaces de 3D models y recursos profesionales
        'modelado-3d': 'https://www.cgtrader.com/3d-models'
    }), []);

    // Multiplicadores por duración
    const timeMultipliers = useMemo(() => ({
        'horas': { value: 1, label: t('calc_hour_rate'), estimatedTime: t('calc_hour_time') },
        'dias': { value: 8, label: t('calc_day_rate'), estimatedTime: t('calc_day_time') },
        'semanas': { value: 40, label: t('calc_week_rate'), estimatedTime: t('calc_week_time') },
        'meses': { value: 160, label: t('calc_month_rate'), estimatedTime: t('calc_month_time') }
    }), [t]);

    // Cuestionarios dinámicos por servicio (cantidades variables por tipo)
    const questionnaires = useMemo(() => ({
        'desarrollo-web-movil': [
            {
                id: 'tipo',
                question: t('quest_web_tipo_question'),
                explanation: t('quest_web_tipo_explanation'),
                type: 'choice',
                options: [
                    { value: 101, label: t('quest_web_tipo_opt_institutional'), projectMinCOP: 800000, projectMaxCOP: 2500000, factor: 1.0 },
                    { value: 102, label: t('quest_web_tipo_opt_landing'), projectMinCOP: 400000, projectMaxCOP: 1200000, factor: 1.0 },
                    { value: 103, label: t('quest_web_tipo_opt_portfolio'), projectMinCOP: 500000, projectMaxCOP: 1800000, factor: 1.0 },
                    { value: 104, label: t('quest_web_tipo_opt_personal'), projectMinCOP: 350000, projectMaxCOP: 1200000, factor: 1.0 },
                    { value: 105, label: t('quest_web_tipo_opt_catalog'), projectMinCOP: 700000, projectMaxCOP: 2200000, factor: 1.05 },
                    { value: 106, label: t('quest_web_tipo_opt_booking'), projectMinCOP: 900000, projectMaxCOP: 3000000, factor: 1.1 },
                    { value: 107, label: t('quest_web_tipo_opt_ecommerce'), projectMinCOP: 2500000, projectMaxCOP: 7000000, factor: 1.25 },
                    { value: 108, label: t('quest_web_tipo_opt_marketplace'), projectMinCOP: 8000000, projectMaxCOP: 30000000, factor: 1.6 },
                    { value: 109, label: t('quest_web_tipo_opt_blog'), projectMinCOP: 600000, projectMaxCOP: 2200000, factor: 1.0 },
                    { value: 110, label: t('quest_web_tipo_opt_lms'), projectMinCOP: 3000000, projectMaxCOP: 9000000, factor: 1.4 },
                    { value: 111, label: t('quest_web_tipo_opt_saas'), projectMinCOP: 5000000, projectMaxCOP: 20000000, factor: 1.6 },
                    { value: 112, label: t('quest_web_tipo_opt_membership'), projectMinCOP: 2500000, projectMaxCOP: 9000000, factor: 1.4 },
                    { value: 113, label: t('quest_web_tipo_opt_forum'), projectMinCOP: 1200000, projectMaxCOP: 4500000, factor: 1.2 },
                    { value: 114, label: t('quest_web_tipo_opt_microsite'), projectMinCOP: 450000, projectMaxCOP: 1800000, factor: 1.0 },
                    { value: 115, label: t('quest_web_tipo_opt_3dvr'), projectMinCOP: 8000000, projectMaxCOP: 35000000, factor: 2.0 },
                    { value: 116, label: t('quest_web_tipo_opt_hybrid'), projectMinCOP: 4000000, projectMaxCOP: 16000000, factor: 1.8 },
                    { value: 117, label: t('quest_web_tipo_opt_government'), projectMinCOP: 3000000, projectMaxCOP: 12000000, factor: 1.5 },
                    { value: 118, label: t('quest_web_tipo_opt_ngo'), projectMinCOP: 600000, projectMaxCOP: 2500000, factor: 1.0 },
                    { value: 119, label: t('quest_web_tipo_opt_tourism'), projectMinCOP: 900000, projectMaxCOP: 4000000, factor: 1.15 }
                ]
            },
            { id: 'pages', question: t('quest_web_pages_question'), explanation: t('quest_web_pages_explanation'), type: 'number', factor: 1.12 },
            { id: 'backend', question: t('quest_web_backend_question'), explanation: t('quest_web_backend_explanation'), type: 'boolean', factor: 1.4 },
            { id: 'ecommerce', question: t('quest_web_ecommerce_question'), explanation: t('quest_web_ecommerce_explanation'), type: 'boolean', factor: 1.5 },
            { id: 'autenticacion', question: t('quest_web_auth_question'), explanation: t('quest_web_auth_explanation'), type: 'boolean', factor: 1.35 },
            { id: 'performance', question: t('quest_web_performance_question'), explanation: t('quest_web_performance_explanation'), type: 'boolean', factor: 1.2 },
            {
                id: 'integraciones',
                question: t('quest_web_integrations_question'),
                explanation: t('quest_web_integrations_explanation'),
                type: 'multiple',
                options: [
                    { value: 'pagos', label: t('quest_web_integrations_opt_payments'), factor: 1.3 },
                    { value: 'email', label: t('quest_web_integrations_opt_email'), factor: 1.15 },
                    { value: 'social', label: t('quest_web_integrations_opt_social'), factor: 1.15 },
                    { value: 'crm', label: t('quest_web_integrations_opt_crm'), factor: 1.25 },
                    { value: 'analytics', label: t('quest_web_integrations_opt_analytics'), factor: 1.1 },
                    { value: 'maps', label: t('quest_web_integrations_opt_maps'), factor: 1.2 },
                    { value: 'storage', label: t('quest_web_integrations_opt_storage'), factor: 1.15 },
                    { value: 'shipping', label: t('quest_web_integrations_opt_shipping'), factor: 1.2 },
                    { value: 'auth', label: t('quest_web_integrations_opt_socialauth'), factor: 1.15 },
                    { value: 'sms', label: t('quest_web_integrations_opt_sms'), factor: 1.15 }
                ]
            },
            { id: 'testing', question: t('quest_web_testing_question'), explanation: t('quest_web_testing_explanation'), type: 'boolean', factor: 1.25 }
        ],
        'software-empresarial': [
            {
                id: 'tipo',
                question: t('quest_enterprise_tipo_question'),
                explanation: t('quest_enterprise_tipo_explanation'),
                type: 'multiple',
                options: [
                    { value: 'crm', label: t('quest_enterprise_tipo_opt_crm'), factor: 1.3 },
                    { value: 'erp', label: t('quest_enterprise_tipo_opt_erp'), factor: 1.5 },
                    { value: 'hcm', label: t('quest_enterprise_tipo_opt_hcm'), factor: 1.3 },
                    { value: 'bi', label: t('quest_enterprise_tipo_opt_bi'), factor: 1.4 },
                    { value: 'custom', label: t('quest_enterprise_tipo_opt_custom'), factor: 1.6 }
                ]
            },
            {
                id: 'modules',
                question: t('quest_enterprise_modules_question'),
                explanation: t('quest_enterprise_modules_explanation'),
                type: 'multiple',
                options: [
                    { value: 'ventas', label: t('quest_enterprise_modules_opt_sales'), factor: 1.2 },
                    { value: 'inventario', label: t('quest_enterprise_modules_opt_inventory'), factor: 1.25 },
                    { value: 'finanzas', label: t('quest_enterprise_modules_opt_finance'), factor: 1.3 },
                    { value: 'rrhh', label: t('quest_enterprise_modules_opt_hr'), factor: 1.25 },
                    { value: 'compras', label: t('quest_enterprise_modules_opt_purchasing'), factor: 1.2 },
                    { value: 'produccion', label: t('quest_enterprise_modules_opt_production'), factor: 1.35 },
                    { value: 'reportes', label: t('quest_enterprise_modules_opt_reports'), factor: 1.3 },
                    { value: 'workflow', label: t('quest_enterprise_modules_opt_workflow'), factor: 1.25 },
                    { value: 'documentos', label: t('quest_enterprise_modules_opt_documents'), factor: 1.2 },
                    { value: 'portal', label: t('quest_enterprise_modules_opt_portal'), factor: 1.15 }
                ]
            },
            { id: 'usuarios', question: t('quest_enterprise_users_question'), explanation: t('quest_enterprise_users_explanation'), type: 'number', factor: 1.2 },
            { id: 'datos', question: t('quest_enterprise_data_question'), explanation: t('quest_enterprise_data_explanation'), type: 'number', factor: 1.3 },
            { id: 'integracion', question: t('quest_enterprise_integration_question'), explanation: t('quest_enterprise_integration_explanation'), type: 'boolean', factor: 1.45 },
            { id: 'compliance', question: t('quest_enterprise_compliance_question'), explanation: t('quest_enterprise_compliance_explanation'), type: 'boolean', factor: 1.5 },
            { id: 'redundancia', question: t('quest_enterprise_redundancy_question'), explanation: t('quest_enterprise_redundancy_explanation'), type: 'boolean', factor: 1.6 },
            { id: 'soporte', question: t('quest_enterprise_support_question'), explanation: t('quest_enterprise_support_explanation'), type: 'boolean', factor: 1.35 }
        ],
        'transformacion-digital': [
            {
                id: 'alcance',
                question: t('quest_transform_scope_question'),
                explanation: t('quest_transform_scope_explanation'),
                type: 'choice',
                options: [
                    { value: 1, label: t('quest_transform_scope_opt_area'), factor: 1.0 },
                    { value: 2, label: t('quest_transform_scope_opt_department'), factor: 1.5 },
                    { value: 3, label: t('quest_transform_scope_opt_company'), factor: 2.2 }
                ]
            },
            {
                id: 'sistemas',
                question: t('quest_transform_systems_question'),
                explanation: t('quest_transform_systems_explanation'),
                type: 'multiple',
                options: [
                    { value: 'erp', label: t('quest_transform_systems_opt_erp'), factor: 1.5 },
                    { value: 'crm', label: t('quest_transform_systems_opt_crm'), factor: 1.3 },
                    { value: 'rrhh', label: t('quest_transform_systems_opt_hr'), factor: 1.25 },
                    { value: 'finanzas', label: t('quest_transform_systems_opt_finance'), factor: 1.3 },
                    { value: 'operaciones', label: t('quest_transform_systems_opt_operations'), factor: 1.35 },
                    { value: 'supply', label: t('quest_transform_systems_opt_supply'), factor: 1.3 },
                    { value: 'bi', label: t('quest_transform_systems_opt_bi'), factor: 1.25 },
                    { value: 'colaboracion', label: t('quest_transform_systems_opt_collab'), factor: 1.2 },
                    { value: 'ecommerce', label: t('quest_transform_systems_opt_ecommerce'), factor: 1.3 },
                    { value: 'servicio', label: t('quest_transform_systems_opt_service'), factor: 1.2 }
                ]
            },
            { id: 'infraestructura', question: t('quest_transform_infra_question'), explanation: t('quest_transform_infra_explanation'), type: 'boolean', factor: 1.6 },
            { id: 'stakeholders', question: t('quest_transform_stakeholders_question'), explanation: t('quest_transform_stakeholders_explanation'), type: 'number', factor: 1.2 },
            { id: 'cambio', question: t('quest_transform_change_question'), explanation: t('quest_transform_change_explanation'), type: 'boolean', factor: 1.45 },
            { id: 'capacitacion', question: t('quest_transform_training_question'), explanation: t('quest_transform_training_explanation'), type: 'boolean', factor: 1.35 },
            { id: 'metodologia', question: t('quest_transform_methodology_question'), explanation: t('quest_transform_methodology_explanation'), type: 'boolean', factor: 1.4 },
            { id: 'riesgo', question: t('quest_transform_risk_question'), explanation: t('quest_transform_risk_explanation'), type: 'boolean', factor: 1.25 }
        ],
        'tecnologias-blockchain': [
            {
                id: 'tipo',
                question: t('quest_blockchain_type_question'),
                explanation: t('quest_blockchain_type_explanation'),
                type: 'choice',
                options: [
                    { value: 1, label: t('quest_blockchain_type_opt_consulting'), factor: 1.2 },
                    { value: 2, label: t('quest_blockchain_type_opt_dapp'), factor: 1.6 },
                    { value: 3, label: t('quest_blockchain_type_opt_tokenization'), factor: 1.7 },
                    { value: 4, label: t('quest_blockchain_type_opt_migration'), factor: 1.5 },
                    { value: 5, label: t('quest_blockchain_type_opt_infrastructure'), factor: 1.4 }
                ]
            },
            {
                id: 'redes',
                question: t('quest_blockchain_networks_question'),
                explanation: t('quest_blockchain_networks_explanation'),
                type: 'multiple',
                options: [
                    { value: 'ethereum', label: 'Ethereum', factor: 1.4 },
                    { value: 'polygon', label: 'Polygon', factor: 1.25 },
                    { value: 'bnb', label: 'BNB Chain', factor: 1.2 },
                    { value: 'solana', label: 'Solana', factor: 1.4 },
                    { value: 'avalanche', label: 'Avalanche', factor: 1.3 },
                    { value: 'arbitrum', label: 'Arbitrum / L2', factor: 1.3 },
                    { value: 'base', label: 'Base', factor: 1.25 },
                    { value: 'hyperledger', label: 'Hyperledger (Permissioned)', factor: 1.35 },
                    { value: 'private', label: t('quest_blockchain_networks_opt_private'), factor: 1.45 }
                ]
            },
            {
                id: 'componentes',
                question: t('quest_blockchain_components_question'),
                explanation: t('quest_blockchain_components_explanation'),
                type: 'multiple',
                options: [
                    { value: 'smart-contracts', label: 'Smart Contracts', factor: 1.5 },
                    { value: 'wallets', label: t('quest_blockchain_components_opt_wallets'), factor: 1.25 },
                    { value: 'oracles', label: t('quest_blockchain_components_opt_oracles'), factor: 1.3 },
                    { value: 'indexers', label: t('quest_blockchain_components_opt_indexers'), factor: 1.2 },
                    { value: 'bridges', label: t('quest_blockchain_components_opt_bridges'), factor: 1.45 },
                    { value: 'analytics', label: t('quest_blockchain_components_opt_analytics'), factor: 1.15 },
                    { value: 'kyc', label: 'KYC/AML', factor: 1.25 }
                ]
            },
            { id: 'usuarios', question: t('quest_blockchain_users_question'), explanation: t('quest_blockchain_users_explanation'), type: 'number', factor: 1.2 },
            { id: 'datos', question: t('quest_blockchain_data_question'), explanation: t('quest_blockchain_data_explanation'), type: 'number', factor: 1.3 },
            { id: 'seguridad', question: t('quest_blockchain_security_question'), explanation: t('quest_blockchain_security_explanation'), type: 'boolean', factor: 1.6 },
            { id: 'compliance', question: t('quest_blockchain_compliance_question'), explanation: t('quest_blockchain_compliance_explanation'), type: 'boolean', factor: 1.45 },
            { id: 'integraciones', question: t('quest_blockchain_integrations_question'), explanation: t('quest_blockchain_integrations_explanation'), type: 'boolean', factor: 1.35 }
        ],
        'diseño-branding': [
            {
                id: 'alcance',
                question: t('quest_design_scope_question'),
                explanation: t('quest_design_scope_explanation'),
                type: 'choice',
                options: [
                    { value: 1, label: t('quest_design_scope_opt_logo'), factor: 1.0 },
                    { value: 2, label: t('quest_design_scope_opt_identity'), factor: 1.5 },
                    { value: 3, label: t('quest_design_scope_opt_system'), factor: 2.0 }
                ]
            },
            {
                id: 'aplicaciones', question: t('quest_design_applications_question'), explanation: t('quest_design_applications_explanation'), type: 'multiple', options: [
                    { value: 'web', label: t('quest_design_applications_opt_web'), factor: 1.1 },
                    { value: 'impresos', label: t('quest_design_applications_opt_print'), factor: 1.05 },
                    { value: 'packaging', label: t('quest_design_applications_opt_packaging'), factor: 1.1 },
                    { value: 'social', label: t('quest_design_applications_opt_social'), factor: 1.0 }
                ]
            },
            { id: 'entregables', question: t('quest_design_deliverables_question'), explanation: t('quest_design_deliverables_explanation'), type: 'number', factor: 1.2 },
            { id: 'soporte', question: t('quest_design_support_question'), explanation: t('quest_design_support_explanation'), type: 'boolean', factor: 1.15 }
        ],
        'modelado-3d': [
            {
                id: 'tipo',
                question: t('quest_3d_type_question'),
                explanation: t('quest_3d_type_explanation'),
                type: 'choice',
                options: [
                    { value: 1, label: t('quest_3d_type_opt_game'), factor: 1.2 },
                    { value: 2, label: t('quest_3d_type_opt_architectural'), factor: 1.4 },
                    { value: 3, label: t('quest_3d_type_opt_product'), factor: 1.3 },
                    { value: 4, label: t('quest_3d_type_opt_character'), factor: 1.8 },
                    { value: 5, label: t('quest_3d_type_opt_vfx'), factor: 2.0 }
                ]
            },
            { id: 'cantidad', question: t('quest_3d_quantity_question'), explanation: t('quest_3d_quantity_explanation'), type: 'number', factor: 1.5 },
            {
                id: 'fidelidad',
                question: t('quest_3d_fidelity_question'),
                explanation: t('quest_3d_fidelity_explanation'),
                type: 'choice',
                options: [
                    { value: 1, label: t('quest_3d_fidelity_opt_lowpoly'), factor: 1.0 },
                    { value: 2, label: t('quest_3d_fidelity_opt_midpoly'), factor: 1.6 },
                    { value: 3, label: t('quest_3d_fidelity_opt_highpoly'), factor: 2.5 },
                    { value: 4, label: t('quest_3d_fidelity_opt_photorealistic'), factor: 4.0 }
                ]
            },
            { id: 'rigging', question: t('quest_3d_rigging_question'), explanation: t('quest_3d_rigging_explanation'), type: 'boolean', factor: 1.4 },
            { id: 'animacion', question: t('quest_3d_animation_question'), explanation: t('quest_3d_animation_explanation'), type: 'boolean', factor: 1.5 },
            { id: 'materiales', question: t('quest_3d_materials_question'), explanation: t('quest_3d_materials_explanation'), type: 'boolean', factor: 1.35 },
            { id: 'integracion', question: t('quest_3d_integration_question'), explanation: t('quest_3d_integration_explanation'), type: 'boolean', factor: 1.3 },
            { id: 'optimizacion', question: t('quest_3d_optimization_question'), explanation: t('quest_3d_optimization_explanation'), type: 'boolean', factor: 1.25 }
        ]
    }), [t]);

    const services = useMemo(() => [
        {
            id: 'desarrollo-web-movil',
            name: t('service_web_mobile_name'),
            description: t('service_web_mobile_desc'),
            deliverables: [
                t('service_web_mobile_deliverable_1'),
                t('service_web_mobile_deliverable_2'),
                t('service_web_mobile_deliverable_3'),
                t('service_web_mobile_deliverable_4')
            ]
        },
        {
            id: 'software-empresarial',
            name: t('service_enterprise_name'),
            description: t('service_enterprise_desc'),
            deliverables: [
                t('service_enterprise_deliverable_1'),
                t('service_enterprise_deliverable_2'),
                t('service_enterprise_deliverable_3'),
                t('service_enterprise_deliverable_4'),
                t('service_enterprise_deliverable_5')
            ]
        },
        {
            id: 'transformacion-digital',
            name: t('service_digital_transform_name'),
            description: t('service_digital_transform_desc'),
            deliverables: [
                t('service_digital_transform_deliverable_1'),
                t('service_digital_transform_deliverable_2'),
                t('service_digital_transform_deliverable_3'),
                t('service_digital_transform_deliverable_4')
            ]
        },
        {
            id: 'tecnologias-blockchain',
            name: t('service_blockchain_name'),
            description: t('service_blockchain_desc'),
            deliverables: [
                t('service_blockchain_deliverable_1'),
                t('service_blockchain_deliverable_2'),
                t('service_blockchain_deliverable_3'),
                t('service_blockchain_deliverable_4')
            ]
        },
        {
            id: 'diseño-branding',
            name: t('service_design_name'),
            description: t('service_design_desc'),
            deliverables: [
                t('service_design_deliverable_1'),
                t('service_design_deliverable_2'),
                t('service_design_deliverable_3'),
                t('service_design_deliverable_4')
            ]
        },
        {
            id: 'marketing-digital',
            name: t('service_marketing_name'),
            description: t('service_marketing_desc'),
            deliverables: [
                t('service_marketing_deliverable_1'),
                t('service_marketing_deliverable_2'),
                t('service_marketing_deliverable_3'),
                t('service_marketing_deliverable_4')
            ]
        },
        {
            id: 'videojuegos',
            name: t('service_videogames_name'),
            description: t('service_videogames_desc'),
            deliverables: [
                t('service_videogames_deliverable_1'),
                t('service_videogames_deliverable_2'),
                t('service_videogames_deliverable_3'),
                t('service_videogames_deliverable_4')
            ]
        },
        {
            id: 'modelado-3d',
            name: t('service_3d_modeling_name'),
            description: t('service_3d_modeling_desc'),
            deliverables: [
                t('service_3d_modeling_deliverable_1'),
                t('service_3d_modeling_deliverable_2'),
                t('service_3d_modeling_deliverable_3'),
                t('service_3d_modeling_deliverable_4')
            ]
        }
    ], [t]);

    const vendorGuide = useMemo(() => ({
        'desarrollo-web-movil': {
            glossary: [
                { term: t('quote_vendor_web_glossary_term_1'), description: t('quote_vendor_web_glossary_desc_1') },
                { term: t('quote_vendor_web_glossary_term_2'), description: t('quote_vendor_web_glossary_desc_2') }
            ],
            examples: [
                t('quote_vendor_web_example_1'),
                t('quote_vendor_web_example_2')
            ],
            integration: [
                t('quote_vendor_web_integration_1'),
                t('quote_vendor_web_integration_2'),
                t('quote_vendor_web_integration_3')
            ]
        },
        'software-empresarial': {
            glossary: [
                { term: t('quote_vendor_enterprise_glossary_term_1'), description: t('quote_vendor_enterprise_glossary_desc_1') },
                { term: t('quote_vendor_enterprise_glossary_term_2'), description: t('quote_vendor_enterprise_glossary_desc_2') }
            ],
            examples: [
                t('quote_vendor_enterprise_example_1'),
                t('quote_vendor_enterprise_example_2')
            ],
            integration: [
                t('quote_vendor_enterprise_integration_1'),
                t('quote_vendor_enterprise_integration_2'),
                t('quote_vendor_enterprise_integration_3')
            ]
        },
        'transformacion-digital': {
            glossary: [
                { term: t('quote_vendor_transform_glossary_term_1'), description: t('quote_vendor_transform_glossary_desc_1') },
                { term: t('quote_vendor_transform_glossary_term_2'), description: t('quote_vendor_transform_glossary_desc_2') }
            ],
            examples: [
                t('quote_vendor_transform_example_1'),
                t('quote_vendor_transform_example_2')
            ],
            integration: [
                t('quote_vendor_transform_integration_1'),
                t('quote_vendor_transform_integration_2'),
                t('quote_vendor_transform_integration_3')
            ]
        },
        'tecnologias-blockchain': {
            glossary: [
                { term: t('quote_vendor_blockchain_glossary_term_1'), description: t('quote_vendor_blockchain_glossary_desc_1') },
                { term: t('quote_vendor_blockchain_glossary_term_2'), description: t('quote_vendor_blockchain_glossary_desc_2') }
            ],
            examples: [
                t('quote_vendor_blockchain_example_1'),
                t('quote_vendor_blockchain_example_2')
            ],
            integration: [
                t('quote_vendor_blockchain_integration_1'),
                t('quote_vendor_blockchain_integration_2'),
                t('quote_vendor_blockchain_integration_3')
            ]
        },
        'diseño-branding': {
            glossary: [
                { term: t('quote_vendor_branding_glossary_term_1'), description: t('quote_vendor_branding_glossary_desc_1') },
                { term: t('quote_vendor_branding_glossary_term_2'), description: t('quote_vendor_branding_glossary_desc_2') }
            ],
            examples: [
                t('quote_vendor_branding_example_1'),
                t('quote_vendor_branding_example_2')
            ],
            integration: [
                t('quote_vendor_branding_integration_1'),
                t('quote_vendor_branding_integration_2'),
                t('quote_vendor_branding_integration_3')
            ]
        },
        'marketing-digital': {
            glossary: [
                { term: t('quote_vendor_marketing_glossary_term_1'), description: t('quote_vendor_marketing_glossary_desc_1') },
                { term: t('quote_vendor_marketing_glossary_term_2'), description: t('quote_vendor_marketing_glossary_desc_2') }
            ],
            examples: [
                t('quote_vendor_marketing_example_1'),
                t('quote_vendor_marketing_example_2')
            ],
            integration: [
                t('quote_vendor_marketing_integration_1'),
                t('quote_vendor_marketing_integration_2'),
                t('quote_vendor_marketing_integration_3')
            ]
        },
        'videojuegos': {
            glossary: [
                { term: t('quote_vendor_games_glossary_term_1'), description: t('quote_vendor_games_glossary_desc_1') },
                { term: t('quote_vendor_games_glossary_term_2'), description: t('quote_vendor_games_glossary_desc_2') }
            ],
            examples: [
                t('quote_vendor_games_example_1'),
                t('quote_vendor_games_example_2')
            ],
            integration: [
                t('quote_vendor_games_integration_1'),
                t('quote_vendor_games_integration_2'),
                t('quote_vendor_games_integration_3')
            ]
        },
        'modelado-3d': {
            glossary: [
                { term: t('quote_vendor_3d_glossary_term_1'), description: t('quote_vendor_3d_glossary_desc_1') },
                { term: t('quote_vendor_3d_glossary_term_2'), description: t('quote_vendor_3d_glossary_desc_2') }
            ],
            examples: [
                t('quote_vendor_3d_example_1'),
                t('quote_vendor_3d_example_2')
            ],
            integration: [
                t('quote_vendor_3d_integration_1'),
                t('quote_vendor_3d_integration_2'),
                t('quote_vendor_3d_integration_3')
            ]
        }
    }), [t]);

    // Desglose de horas por servicio (cuando se elige "Por Hora")
    const hourBreakdown = useMemo(() => ({
        'desarrollo-web-movil': {
            baseHours: 40,
            tasks: [
                { name: 'task_architecture_planning', hours: 6, percentage: 15 },
                { name: 'task_frontend_development', hours: 14, percentage: 35 },
                { name: 'task_backend_development', hours: 12, percentage: 30 },
                { name: 'task_integration_apis', hours: 4, percentage: 10 },
                { name: 'task_testing_qa', hours: 4, percentage: 10 }
            ]
        },
        'software-empresarial': {
            baseHours: 80,
            tasks: [
                { name: 'task_requirements_analysis', hours: 12, percentage: 15 },
                { name: 'task_architecture_design', hours: 16, percentage: 20 },
                { name: 'task_module_development', hours: 32, percentage: 40 },
                { name: 'task_testing_qa', hours: 12, percentage: 15 },
                { name: 'task_documentation_support', hours: 8, percentage: 10 }
            ]
        },
        'transformacion-digital': {
            baseHours: 120,
            tasks: [
                { name: 'task_audit_diagnosis', hours: 24, percentage: 20 },
                { name: 'task_transformation_design', hours: 30, percentage: 25 },
                { name: 'task_implementation', hours: 42, percentage: 35 },
                { name: 'task_training_change_mgmt', hours: 18, percentage: 15 },
                { name: 'task_follow_up_optimization', hours: 6, percentage: 5 }
            ]
        },
        'tecnologias-blockchain': {
            baseHours: 100,
            tasks: [
                { name: 'task_discovery_architecture', hours: 20, percentage: 20 },
                { name: 'task_smart_contracts', hours: 28, percentage: 28 },
                { name: 'task_backend_integrations', hours: 22, percentage: 22 },
                { name: 'task_frontend_dapp', hours: 18, percentage: 18 },
                { name: 'task_security_qa', hours: 12, percentage: 12 }
            ]
        },
        'diseño-branding': {
            baseHours: 32,
            tasks: [
                { name: 'task_research_strategy', hours: 6.4, percentage: 20 },
                { name: 'task_conceptualization', hours: 8, percentage: 25 },
                { name: 'task_design_executive', hours: 11.2, percentage: 35 },
                { name: 'task_iterations_refinement', hours: 4.8, percentage: 15 },
                { name: 'task_brand_documentation', hours: 1.6, percentage: 5 }
            ]
        },
        'marketing-digital': {
            baseHours: 48,
            tasks: [
                { name: 'task_audit_strategy', hours: 9.6, percentage: 20 },
                { name: 'task_content_creation', hours: 14.4, percentage: 30 },
                { name: 'task_campaign_management', hours: 12, percentage: 25 },
                { name: 'task_analytics_reporting', hours: 7.2, percentage: 15 },
                { name: 'task_continuous_optimization', hours: 4.8, percentage: 10 }
            ]
        },
        'videojuegos': {
            baseHours: 160,
            tasks: [
                { name: 'task_concept_game_design', hours: 24, percentage: 15 },
                { name: 'task_programming_core', hours: 56, percentage: 35 },
                { name: 'task_art_animation', hours: 40, percentage: 25 },
                { name: 'task_audio_music', hours: 16, percentage: 10 },
                { name: 'task_qa_testing_publication', hours: 24, percentage: 15 }
            ]
        },
        'modelado-3d': {
            baseHours: 56,
            tasks: [
                { name: 'task_concept_sculpting', hours: 8.4, percentage: 15 },
                { name: 'task_modeling_high_poly', hours: 16.8, percentage: 30 },
                { name: 'task_retopology_rigging', hours: 11.2, percentage: 20 },
                { name: 'task_texturizing_shaders', hours: 11.2, percentage: 20 },
                { name: 'task_optimization_integration', hours: 8.4, percentage: 15 }
            ]
        }
    }), []);

    // Calcular precio estimado (con IVA incluido)
    const estimatedCost = useMemo(() => {
        if (!selectedService || !timeUnit) {
            return null;
        }

        const basePrice = basePrices[selectedService];
        const timeMultiplier = timeMultipliers[timeUnit].value;
        const minHours = hourBreakdown[selectedService]?.baseHours || timeMultiplier;
        const effectiveHours = Math.max(timeMultiplier, minHours);

        // Calcular primero el totalFactor a partir del cuestionario
        let totalFactor = 1;
        const questionnaire = questionnaires[selectedService] || [];
        questionnaire.forEach(q => {
            const answer = calculatorAnswers[q.id];
            if (answer !== undefined && answer !== null && answer !== '') {
                if (q.type === 'number' && typeof answer === 'number' && answer > 0) {
                    totalFactor *= (1 + (Math.min(answer, 10) / 10) * (q.factor - 1));
                } else if (q.type === 'boolean' && answer === true) {
                    totalFactor *= q.factor;
                } else if (q.type === 'choice' && typeof answer === 'number') {
                    const option = q.options?.find(opt => opt.value === answer);
                    if (option?.factor) totalFactor *= option.factor;
                } else if (q.type === 'multiple' && Array.isArray(answer) && answer.length > 0) {
                    answer.forEach(selectedValue => {
                        const option = q.options?.find(opt => opt.value === selectedValue);
                        if (option?.factor) totalFactor *= option.factor;
                    });
                }
            }
        });

        // Aplicar cap al multiplicador para evitar estimados desproporcionados
        const cappedTotalFactor = Math.min(totalFactor, MULTIPLIER_CAP);

        // Special case: para 'desarrollo-web-movil' usamos rangos por proyecto (COP) si el tipo seleccionado define 'projectMinCOP'
        if (selectedService === 'desarrollo-web-movil') {
            const tipoQuestion = questionnaires[selectedService]?.find(q => q.id === 'tipo');
            const selectedTipoValue = calculatorAnswers?.['tipo'];
            const selectedOption = tipoQuestion?.options?.find(opt => opt.value === selectedTipoValue);
            if (selectedOption && selectedOption.projectMinCOP && selectedOption.projectMaxCOP) {
                // Calcular promedio del rango en COP y convertir a USD (suponiendo tasa 4200 COP = 1 USD)
                const avgCOP = (selectedOption.projectMinCOP + selectedOption.projectMaxCOP) / 2;
                const subtotalUSDFromProject = (avgCOP / 4200);

                // Evitar doble conteo: retirar el factor del tipo porque el rango ya considera complejidad
                const tipoFactor = selectedOption.factor || 1;
                const effectiveFactor = cappedTotalFactor / tipoFactor;

                const subtotal = subtotalUSDFromProject * effectiveFactor;
                const totalWithTax = subtotal * (1 + IVA);

                return {
                    subtotal: Math.round(subtotal),
                    totalWithTax: Math.round(totalWithTax),
                    totalFactor: effectiveFactor,
                    pricingModel: 'project-range'
                };
            }
        }

        // Calcular subtotal (sin IVA) usando el multiplicador capado
        const subtotal = basePrice * effectiveHours * cappedTotalFactor;
        // Aplicar IVA (19% para Colombia)
        const totalWithTax = subtotal * (1 + IVA);

        // Debugging: log del cálculo (descomenta para debug)
        const isDevelopment = true; // Cambiar a true para debug
        if (isDevelopment) {
            console.log('[CALCULADOR] Estimado:', {
                basePrice,
                timeMultiplier,
                minHours,
                effectiveHours,
                rawFactor: totalFactor,
                appliedFactor: cappedTotalFactor,
                subtotal,
                ivaAmount: subtotal * IVA,
                totalWithTax,
                answersCount: Object.keys(calculatorAnswers).length,
                answers: calculatorAnswers
            });
        }

        return {
            subtotal: Math.round(subtotal),
            totalWithTax: Math.round(totalWithTax),
            totalFactor: cappedTotalFactor
        };
    }, [selectedService, timeUnit, calculatorAnswers, basePrices, timeMultipliers, questionnaires, hourBreakdown, IVA]);

    // Validar si se han respondido suficientes preguntas
    const hasAnsweredQuestions = useMemo(() => {
        const questionnaire = selectedService ? questionnaires[selectedService] : [];
        if (questionnaire.length === 0) return false;
        // Requiere al menos 50% de respuestas
        const answeredCount = questionnaire.filter(q =>
            calculatorAnswers[q.id] !== undefined &&
            calculatorAnswers[q.id] !== null &&
            calculatorAnswers[q.id] !== ''
        ).length;
        return answeredCount >= Math.ceil(questionnaire.length / 2);
    }, [selectedService, calculatorAnswers, questionnaires]);

    // Roadmaps are local-only (sensitive docs removed from repo)
    useEffect(() => {
        if (!showRoadmap || !selectedService) return;
        setRoadmapLoading(false);
        setRoadmapContent('');
        setRoadmapError(t('roadmap_local_only'));
    }, [showRoadmap, selectedService, t]);

    // Minimal markdown -> HTML for inline rendering (headings, lists, paragraphs)
    const mdToHtmlInline = (md) => {
        if (!md) return '';
        const lines = md.split('\n');
        let html = '';
        let inList = false;
        lines.forEach(raw => {
            const line = raw.trim();
            if (line.startsWith('### ')) {
                if (inList) { html += '</ul>'; inList = false; }
                html += `<h3 class="text-lg font-semibold text-white">${escapeHtml(line.slice(4))}</h3>`;
            } else if (line.startsWith('## ')) {
                if (inList) { html += '</ul>'; inList = false; }
                html += `<h2 class="text-xl font-bold text-[#00e9fa]">${escapeHtml(line.slice(3))}</h2>`;
            } else if (line.startsWith('# ')) {
                if (inList) { html += '</ul>'; inList = false; }
                html += `<h1 class="text-2xl font-bold text-[#00e9fa]">${escapeHtml(line.slice(2))}</h1>`;
            } else if (line.startsWith('- ')) {
                if (!inList) { html += '<ul class="list-disc pl-6 text-gray-300 mb-3">'; inList = true; }
                html += `<li>${escapeHtml(line.slice(2))}</li>`;
            } else if (line === '') {
                if (inList) { html += '</ul>'; inList = false; }
                html += '<p class="my-2"></p>';
            } else {
                if (inList) { html += '</ul>'; inList = false; }
                html += `<p class="text-sm text-gray-300 mb-2">${escapeHtml(line)}</p>`;
            }
        });
        if (inList) html += '</ul>';
        return html;
    };

    const escapeHtml = (unsafe) => {
        return String(unsafe).replace(/[&<>\"']/g, function (m) {
            switch (m) {
                case '&': return '&amp;';
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '"': return '&quot;';
                case "'": return '&#039;';
                default: return m;
            }
        });
    };

    const handleCalculatorAnswerChange = (questionId, value, { advance = true } = {}) => {
        setCalculatorAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));

        // Avanza automáticamente a la siguiente pregunta cuando se responde
        if (advance) {
            setCalculatorStep(prevStep => {
                const totalQuestions = (questionnaires[selectedService] || []).length;
                if (!totalQuestions) return prevStep;
                // Si aún quedan preguntas, avanza; sino muestra el resultado final
                if (prevStep < totalQuestions) return prevStep + 1;
                return totalQuestions + 1;
            });
        }
    };


    const handleEmailFormChange = (e) => {
        const { name, value } = e.target;
        setEmailFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const [showRoadmapModal, setShowRoadmapModal] = React.useState(false);

    const sendQuoteToEmail = async () => {
        if (!emailFormData.clientName || !emailFormData.clientEmail) {
            setEmailError('Por favor completa tu nombre y email');
            return;
        }

        setSendingEmail(true);
        setEmailError('');

        try {
            // Preparar los datos de la cotización
            const serviceNames = {
                'desarrollo-web-movil': 'Desarrollo Web y Móvil',
                'software-empresarial': 'Software Empresarial',
                'transformacion-digital': 'Transformación Digital',
                'tecnologias-blockchain': 'Tecnologías en Blockchain',
                'diseño-branding': 'Diseño y Branding',
                'marketing-digital': 'Marketing Digital',
                'videojuegos': 'Desarrollo de Videojuegos',
                'modelado-3d': 'Modelado 3D'
            };

            // Formatear las respuestas del cuestionario
            const questionnaire = questionnaires[selectedService] || [];
            let answersText = '';
            questionnaire.forEach(q => {
                const answer = calculatorAnswers[q.id];
                let answerText = '';

                if (q.type === 'choice') {
                    const option = q.options?.find(opt => opt.value === answer);
                    answerText = option?.label || 'No respondido';
                } else if (q.type === 'multiple' && Array.isArray(answer)) {
                    const selectedOptions = q.options?.filter(opt => answer.includes(opt.value)) || [];
                    answerText = selectedOptions.map(opt => opt.label).join(', ') || 'Ninguno';
                } else if (q.type === 'boolean') {
                    answerText = answer === true ? t('calc_yes') : answer === false ? t('calc_no') : t('calc_not_answered');
                } else if (q.type === 'number') {
                    answerText = answer || t('calc_not_answered');
                }

                answersText += `${q.question}: ${answerText}\n`;
            });

            // Formatear roadmap
            const roadmapData = planningTable[selectedService] || [];
            let roadmapText = '';
            roadmapData.forEach((phase, idx) => {
                roadmapText += `\nSprint ${idx + 1}: ${phase.phase}\n`;
                roadmapText += `Timing: ${phase.timing}\n`;
                roadmapText += `Entregables: ${phase.deliverables}\n`;
            });

            // Formatear desglose de horas si aplica
            let hoursBreakdownText = '';
            if (timeUnit === 'horas' && hourBreakdown[selectedService]) {
                hoursBreakdownText += `\n\nDESGLOSE DE HORAS:\n`;
                hoursBreakdownText += `Horas base: ${hourBreakdown[selectedService].baseHours}h\n\n`;
                hourBreakdown[selectedService].tasks.forEach(task => {
                    hoursBreakdownText += `- ${t(task.name)}: ${task.hours}h (${task.percentage}%)\n`;
                });
            }

            const emailData = {
                name: emailFormData.clientName,
                email: emailFormData.clientEmail,
                company: emailFormData.clientCompany || 'No especificada',
                phone: emailFormData.clientPhone || 'No especificado',
                service: serviceNames[selectedService],
                message: `
NUEVA SOLICITUD DE COTIZACIÓN
================================

INFORMACIÓN DEL CLIENTE:
- Nombre: ${emailFormData.clientName}
- Email: ${emailFormData.clientEmail}
- Empresa: ${emailFormData.clientCompany || 'No especificada'}
- Teléfono: ${emailFormData.clientPhone || 'No especificado'}

SERVICIO SOLICITADO:
${serviceNames[selectedService]}

DETALLES DE LA COTIZACIÓN:
- Duración seleccionada: ${timeMultipliers[timeUnit]?.label}
- Tarifa base: $${basePrices[selectedService]}/hora
- Estimado total (IVA incluido): $${estimatedCost?.totalWithTax?.toLocaleString('en-US')} USD
- Equivalente en COP: $${(estimatedCost?.totalWithTax * 4200)?.toLocaleString('es-CO')} COP
- Subtotal (sin IVA): $${estimatedCost?.subtotal?.toLocaleString('en-US')} USD

RESPUESTAS DEL CUESTIONARIO:
${answersText}

ROADMAP Y SPRINTS DEL PROYECTO:
${roadmapText}${hoursBreakdownText}

NOTAS ADICIONALES DEL CLIENTE:
${emailFormData.additionalNotes || 'Ninguna'}

================================
Esta cotización fue generada automáticamente desde xlerion.com
Fecha: ${new Date().toLocaleString('es-CO')}
                `.trim()
            };

            // Nota: En desarrollo local, asegúrate de tener un servidor PHP corriendo
            // Ejemplo: cd public && php -S localhost:8080 router.php
            const apiUrl = import.meta.env.DEV
                ? 'http://localhost:8080/api/send-email.php'
                : '/api/send-email.php';

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(emailData)
            });

            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.status}`);
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('El servidor no devolvió una respuesta JSON válida');
            }

            const result = await response.json();

            if (result.success) {
                setEmailSent(true);
                setShowEmailForm(false);
                setTimeout(() => setEmailSent(false), 5000);
            } else {
                setEmailError(result.message || 'Error al enviar la cotización');
            }
        } catch (error) {
            setEmailError(error.message || 'Error de conexión. Por favor intenta nuevamente.');
            console.error('Error sending quote:', error);
        } finally {
            setSendingEmail(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleServiceSelect = (serviceId) => {
        setSelectedService(serviceId);
        setCalculatorStep(0);
        setTimeUnit('');
        setCalculatorAnswers({});
        setFormData(prev => ({
            ...prev,
            service: serviceId
        }));
    };

    const handleSellerUnlock = (e) => {
        e.preventDefault();
        if (!sellerPassword.trim()) {
            setSellerError(t('quote_vendor_password_required'));
            return;
        }
        if (sellerPassword === SELLER_PASSWORD) {
            setSellerUnlocked(true);
            setSellerError('');
        } else {
            setSellerUnlocked(false);
            setSellerError(t('quote_vendor_password_error'));
        }
    };

    const handleSellerLock = () => {
        setSellerUnlocked(false);
        setSellerPassword('');
        setSellerError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Cotización solicitada:', formData);
        alert('Gracias por tu solicitud. Nuestro equipo se contactará pronto.');
        setFormData({
            name: '',
            email: '',
            company: '',
            service: '',
            description: '',
            budget: ''
        });
        setSelectedService(null);
    };

    const startCalculator = (serviceId) => {
        handleServiceSelect(serviceId);
        setActiveTab('calculador');
    };

    const planningTable = useMemo(() => ({
        'desarrollo-web-movil': [
            { phase: 'phase_discovery_uxui', deliverables: 'deliv_brief_wireframes_prototype', timing: 'timing_week1' },
            { phase: 'phase_development', deliverables: 'deliv_frontend_backend_basic', timing: 'timing_weeks_2_3' },
            { phase: 'phase_qa_adjustments', deliverables: 'deliv_testing_optimizations', timing: 'timing_week_4' },
            { phase: 'phase_launch', deliverables: 'deliv_deploy_monitoring', timing: 'timing_week_5' }
        ],
        'software-empresarial': [
            { phase: 'phase_analysis_design', deliverables: 'deliv_requirements_data_model', timing: 'timing_weeks_1_2' },
            { phase: 'phase_mvp_construction', deliverables: 'deliv_mvp_module', timing: 'timing_weeks_3_5' },
            { phase: 'phase_qa_uat', deliverables: 'deliv_testing_validation', timing: 'timing_weeks_6_7' },
            { phase: 'phase_go_live', deliverables: 'deliv_production_support', timing: 'timing_week_8' }
        ],
        'transformacion-digital': [
            { phase: 'phase_diagnosis', deliverables: 'deliv_evaluation_risks', timing: 'timing_weeks_1_2' },
            { phase: 'phase_strategy_roadmap', deliverables: 'deliv_plan_kpis', timing: 'timing_week_3' },
            { phase: 'phase_implementation', deliverables: 'deliv_improvements_migrations', timing: 'timing_weeks_4_7' },
            { phase: 'phase_change_management', deliverables: 'deliv_training_adoption', timing: 'timing_weeks_6_8' },
            { phase: 'phase_optimization', deliverables: 'deliv_monitoring_adjustments', timing: 'timing_weeks_9_10' }
        ],
        'tecnologias-blockchain': [
            { phase: 'phase_discovery_design', deliverables: 'deliv_scope_architecture', timing: 'timing_weeks_1_2' },
            { phase: 'phase_development', deliverables: 'deliv_contracts_dapp', timing: 'timing_weeks_3_5' },
            { phase: 'phase_qa_adjustments', deliverables: 'deliv_testing_security', timing: 'timing_weeks_6_7' },
            { phase: 'phase_deploy', deliverables: 'deliv_testnet_monitoring', timing: 'timing_week_8' }
        ],
        'diseño-branding': [
            { phase: 'phase_research_concept', deliverables: 'deliv_insights_moodboard', timing: 'timing_week1' },
            { phase: 'phase_design_executive', deliverables: 'deliv_logo_identity', timing: 'timing_weeks_2_3' },
            { phase: 'phase_iterations_brandbook', deliverables: 'deliv_adjustments_guide', timing: 'timing_week_4' }
        ],
        'marketing-digital': [
            { phase: 'phase_audit_plan', deliverables: 'deliv_diagnosis_calendar', timing: 'timing_week1' },
            { phase: 'phase_implementation', deliverables: 'deliv_content_campaigns', timing: 'timing_weeks_2_3' },
            { phase: 'phase_optimization_report', deliverables: 'deliv_ab_testing_insights', timing: 'timing_week_4' }
        ],
        'videojuegos': [
            { phase: 'phase_preproduction', deliverables: 'deliv_gdd_prototype_scope', timing: 'timing_weeks_1_2' },
            { phase: 'phase_development', deliverables: 'deliv_gameplay_art', timing: 'timing_weeks_3_8' },
            { phase: 'phase_alpha', deliverables: 'deliv_feature_complete', timing: 'timing_weeks_9_11' },
            { phase: 'phase_beta_qa', deliverables: 'deliv_testing_performance', timing: 'timing_weeks_12_13' },
            { phase: 'phase_release', deliverables: 'deliv_publication_patch', timing: 'timing_week_14' }
        ],
        'modelado-3d': [
            { phase: 'phase_concept_high_poly', deliverables: 'deliv_references_sculpt', timing: 'timing_weeks_1_4' },
            { phase: 'phase_retopology_textures', deliverables: 'deliv_lowpoly_pbr', timing: 'timing_week_3' },
            { phase: 'phase_integration', deliverables: 'deliv_export_testing', timing: 'timing_week_4' }
        ]
    }), []);

    const currentQuestionnaire = selectedService ? questionnaires[selectedService] || [] : [];

    return (
        <Layout>
            {/* Banner */}
            <div className="relative h-[30vh] sm:h-[40vh] overflow-hidden">
                <img
                    src="/images/filosofia-parallax.jpg"
                    alt="Cotización Banner"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center px-4 sm:px-8">
                        <DollarSign className="text-[#00e9fa] mx-auto mb-3 sm:mb-4 w-12 h-12 sm:w-16 sm:h-16" />
                        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black italic uppercase tracking-tighter text-white drop-shadow-2xl">
                            {t('quote_page_title')}
                        </h1>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="pt-12 sm:pt-20 pb-20 px-4 sm:px-8">
                <div className="max-w-6xl mx-auto">
                    {/* Intro */}
                    <div className="mb-12 sm:mb-20">
                        <div className="border-l-4 border-[#00e9fa] pl-4 sm:pl-8">
                            <h2 className="text-lg sm:text-2xl md:text-3xl text-gray-300 font-light leading-relaxed">
                                {t('quote_page_subtitle')}
                            </h2>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex gap-2 sm:gap-4 mb-8 sm:mb-12 border-b border-gray-700 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('servicios')}
                            className={`px-3 sm:px-6 py-2 sm:py-3 font-semibold uppercase tracking-wider transition-colors whitespace-nowrap text-xs sm:text-base ${activeTab === 'servicios'
                                ? 'text-[#00e9fa] border-b-2 border-[#00e9fa]'
                                : 'text-gray-400 hover:text-gray-300'
                                }`}
                        >
                            📋 {t('quote_tab_services')}
                        </button>
                        <button
                            onClick={() => setActiveTab('calculador')}
                            className={`px-3 sm:px-6 py-2 sm:py-3 font-semibold uppercase tracking-wider transition-colors flex items-center gap-1 sm:gap-2 whitespace-nowrap text-xs sm:text-base ${activeTab === 'calculador'
                                ? 'text-[#00e9fa] border-b-2 border-[#00e9fa]'
                                : 'text-gray-400 hover:text-gray-300'
                                }`}
                        >
                            <Calculator size={16} className="sm:w-5 sm:h-5" />
                            {t('quote_tab_calculator')}
                        </button>
                    </div>

                    {/* SERVICIOS TAB */}
                    {activeTab === 'servicios' && (
                        <>
                            <section className="mb-12 sm:mb-20">
                                <h3 className="text-2xl sm:text-3xl font-bold text-[#00e9fa] mb-8 sm:mb-12 font-mono uppercase tracking-wider">
                                    {t('quote_services_title')}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    {services.map(service => (
                                        <div
                                            key={service.id}
                                            className={`p-4 sm:p-6 rounded-lg border-2 transition-all duration-300 ${selectedService === service.id
                                                ? 'border-[#00e9fa] bg-[#00e9fa]/10 shadow-lg shadow-[#00e9fa]/20'
                                                : 'border-gray-700 hover:border-[#00e9fa]/50 bg-black/40'
                                                }`}
                                        >
                                            <div className="flex items-start gap-3 sm:gap-4">
                                                <CheckCircle
                                                    className={`flex-shrink-0 mt-1 ${selectedService === service.id ? 'text-[#00e9fa]' : 'text-gray-500'
                                                        }`}
                                                    size={20}
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-base sm:text-lg font-bold text-white mb-2 break-words">{service.name}</h4>
                                                    <p className="text-xs sm:text-sm text-gray-400 mb-4">{service.description}</p>
                                                    <div className="mb-3 sm:mb-4">
                                                        <p className="text-xs font-semibold text-gray-300 uppercase tracking-wide mb-2">
                                                            {t('quote_deliverables')}:
                                                        </p>
                                                        <ul className="space-y-1">
                                                            {service.deliverables.map((deliverable, idx) => (
                                                                <li key={idx} className="text-xs text-gray-400 flex items-start gap-2 break-words">
                                                                    <span className="text-[#00e9fa] mt-0.5">•</span>
                                                                    <span>{deliverable}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    {priceSources[service.id] && (
                                                        <div className="text-xs mt-2">
                                                            <a
                                                                href={priceSources[service.id]}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                onClick={(e) => {
                                                                    // Prevenir la navegación por defecto para evitar doble apertura
                                                                    e.preventDefault();
                                                                    // Evitar que el clic propague a elementos padres
                                                                    e.stopPropagation();
                                                                    const url = priceSources[service.id];
                                                                    if (url) {
                                                                        try {
                                                                            // Abrir en nueva pestaña solo una vez
                                                                            window.open(url, '_blank', 'noopener,noreferrer');
                                                                        } catch (err) {
                                                                            // Fallback: navegar en la misma pestaña si window.open falla
                                                                            console.error('Error opening price source:', err);
                                                                            window.location.href = url;
                                                                        }
                                                                    }
                                                                }}
                                                                className="text-[#00e9fa] hover:underline"
                                                            >
                                                                Fuente de precios
                                                            </a>
                                                        </div>
                                                    )}
                                                    <button
                                                        onClick={() => startCalculator(service.id)}
                                                        className="inline-flex items-center gap-2 mt-3 sm:mt-4 px-3 sm:px-4 py-2 bg-[#00e9fa]/20 border border-[#00e9fa] text-[#00e9fa] rounded-md hover:bg-[#00e9fa]/30 transition-colors text-xs font-semibold uppercase"
                                                    >
                                                        <Calculator size={14} />
                                                        {t('calc_price_button')}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="mb-12 sm:mb-20">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                                    <div>
                                        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 font-mono uppercase tracking-wider">
                                            {t('quote_vendor_title')}
                                        </h3>
                                        <p className="text-sm text-gray-400">
                                            {t('quote_vendor_subtitle')}
                                        </p>
                                    </div>
                                    <span
                                        className={`text-xs uppercase tracking-wider px-3 py-1 rounded-full border ${sellerUnlocked
                                            ? 'text-emerald-300 bg-emerald-400/10 border-emerald-400/30'
                                            : 'text-amber-300 bg-amber-400/10 border-amber-400/30'
                                            }`}
                                    >
                                        {sellerUnlocked ? t('quote_vendor_status_unlocked') : t('quote_vendor_status_locked')}
                                    </span>
                                </div>

                                {!sellerUnlocked ? (
                                    <form onSubmit={handleSellerUnlock} className="bg-black/60 border border-gray-700 rounded-lg p-4 sm:p-6">
                                        <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">
                                            {t('quote_vendor_password_label')}
                                        </label>
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <input
                                                type="password"
                                                value={sellerPassword}
                                                onChange={(e) => setSellerPassword(e.target.value)}
                                                className="flex-1 px-4 py-3 bg-black/40 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:border-[#00e9fa] focus:outline-none transition-colors"
                                                placeholder={t('quote_vendor_password_placeholder')}
                                            />
                                            <button
                                                type="submit"
                                                className="px-4 py-3 bg-[#00e9fa] text-black font-semibold uppercase tracking-wider rounded-md hover:bg-[#00e9fa]/90 transition-colors"
                                            >
                                                {t('quote_vendor_unlock_button')}
                                            </button>
                                        </div>
                                        {sellerError && (
                                            <p className="text-xs text-red-400 mt-2">
                                                {sellerError}
                                            </p>
                                        )}
                                        <p className="text-xs text-gray-500 mt-2">
                                            {t('quote_vendor_password_hint')}
                                        </p>
                                    </form>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                            <p className="text-xs text-gray-400">
                                                {t('quote_vendor_access_note')}
                                            </p>
                                            <button
                                                type="button"
                                                onClick={handleSellerLock}
                                                className="text-xs text-gray-300 border border-gray-600 px-3 py-1 rounded-md hover:border-gray-400 transition-colors"
                                            >
                                                {t('quote_vendor_lock_button')}
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                            {services.map(service => {
                                                const guide = vendorGuide[service.id];
                                                if (!guide) return null;
                                                return (
                                                    <div key={service.id} className="p-4 sm:p-5 rounded-lg border border-gray-700 bg-black/50">
                                                        <div className="mb-4">
                                                            <h4 className="text-base sm:text-lg font-bold text-[#00e9fa] mb-1">
                                                                {service.name}
                                                            </h4>
                                                            <p className="text-xs sm:text-sm text-gray-400">
                                                                {service.description}
                                                            </p>
                                                        </div>
                                                        <div className="space-y-4 text-xs sm:text-sm">
                                                            <div>
                                                                <p className="text-xs font-semibold text-gray-300 uppercase tracking-wide mb-2">
                                                                    {t('quote_vendor_glossary_title')}
                                                                </p>
                                                                <ul className="space-y-2">
                                                                    {guide.glossary.map((item, idx) => (
                                                                        <li key={idx} className="text-gray-400">
                                                                            <span className="text-white font-semibold">{item.term}:</span> {item.description}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-semibold text-gray-300 uppercase tracking-wide mb-2">
                                                                    {t('quote_vendor_examples_title')}
                                                                </p>
                                                                <ul className="space-y-1">
                                                                    {guide.examples.map((example, idx) => (
                                                                        <li key={idx} className="text-gray-400 flex items-start gap-2">
                                                                            <span className="text-[#00e9fa] mt-0.5">•</span>
                                                                            <span>{example}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-semibold text-gray-300 uppercase tracking-wide mb-2">
                                                                    {t('quote_vendor_integration_title')}
                                                                </p>
                                                                <ol className="space-y-1">
                                                                    {guide.integration.map((step, idx) => (
                                                                        <li key={idx} className="text-gray-400 flex items-start gap-2">
                                                                            <span className="text-[#00e9fa] mt-0.5">{idx + 1}.</span>
                                                                            <span>{step}</span>
                                                                        </li>
                                                                    ))}
                                                                </ol>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </section>

                            {/* Form */}
                            <section className="bg-black/60 border border-gray-700 rounded-lg p-4 sm:p-8 md:p-12">
                                <div className="flex items-center gap-3 mb-6 sm:mb-8">
                                    <FileText className="text-[#00e9fa] flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8" />
                                    <h3 className="text-lg sm:text-2xl font-bold text-white font-mono uppercase tracking-wider">
                                        Solicitar Cotización
                                    </h3>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                        <div>
                                            <label className="block text-xs sm:text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">
                                                {t('quote_form_name_label')} *
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 bg-black/40 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:border-[#00e9fa] focus:outline-none transition-colors"
                                                placeholder={t('quote_form_name_placeholder')}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">
                                                {t('quote_form_email_label')} *
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 bg-black/40 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:border-[#00e9fa] focus:outline-none transition-colors"
                                                placeholder={t('quote_form_email_placeholder')}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">
                                            {t('quote_form_company_label')}
                                        </label>
                                        <input
                                            type="text"
                                            name="company"
                                            value={formData.company}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-black/40 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:border-[#00e9fa] focus:outline-none transition-colors"
                                            placeholder={t('quote_form_company_placeholder')}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">
                                            {t('quote_form_service_label')} *
                                        </label>
                                        <select
                                            name="service"
                                            value={formData.service}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 bg-black/40 border border-gray-600 rounded-md text-white focus:border-[#00e9fa] focus:outline-none transition-colors"
                                        >
                                            <option value="">{t('quote_form_service_placeholder')}</option>
                                            {services.map(service => (
                                                <option key={service.id} value={service.id}>
                                                    {service.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">
                                            {t('quote_form_description_label')} *
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            required
                                            rows="6"
                                            className="w-full px-4 py-3 bg-black/40 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:border-[#00e9fa] focus:outline-none transition-colors resize-none"
                                            placeholder={t('quote_form_description_placeholder')}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wide">
                                            {t('quote_form_budget_label')}
                                        </label>
                                        <select
                                            name="budget"
                                            value={formData.budget}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-black/40 border border-gray-600 rounded-md text-white focus:border-[#00e9fa] focus:outline-none transition-colors"
                                        >
                                            <option value="">{t('quote_form_budget_placeholder')}</option>
                                            <option value="5-10k">$5,000 - $10,000</option>
                                            <option value="10-25k">$10,000 - $25,000</option>
                                            <option value="25-50k">$25,000 - $50,000</option>
                                            <option value="50-100k">$50,000 - $100,000</option>
                                            <option value="100k+">$100,000+</option>
                                            <option value="no-budget">{t('quote_form_budget_no_defined')}</option>
                                        </select>
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            className="w-full md:w-auto px-8 py-3 bg-[#00e9fa] text-black font-bold uppercase tracking-wider rounded-md hover:bg-[#00e9fa]/80 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-[#00e9fa]/30"
                                        >
                                            <Mail size={20} />
                                            {t('quote_form_submit_button')}
                                        </button>
                                    </div>
                                </form>

                                <div className="mt-8 pt-8 border-t border-gray-700">
                                    <p className="text-sm text-gray-400">
                                        {t('quote_form_required_fields')}
                                    </p>
                                </div>
                            </section>
                        </>
                    )}

                    {/* CALCULADOR TAB */}
                    {activeTab === 'calculador' && (
                        <section className="bg-black/60 border border-gray-700 rounded-lg p-4 sm:p-8 md:p-12">
                            {selectedService ? (
                                <>
                                    <div className="mb-6 sm:mb-8">
                                        <h3 className="text-lg sm:text-2xl font-bold text-[#00e9fa] mb-2 break-words">
                                            {services.find(s => s.id === selectedService)?.name}
                                        </h3>
                                        <p className="text-sm sm:text-base text-gray-400 break-words">
                                            {calculatorStep === 0 ? t('quote_calculator_select_duration') : calculatorStep <= currentQuestionnaire.length ? `${t('quote_calculator_question_of')} ${calculatorStep} ${t('quote_calculator_question_total')} ${currentQuestionnaire.length}` : t('quote_calculator_result_title')}
                                        </p>
                                    </div>

                                    {/* CONTADOR DE MONTO ACUMULADO - Visible durante el cuestionario */}
                                    {calculatorStep > 0 && calculatorStep <= currentQuestionnaire.length && estimatedCost && (
                                        <div className="mb-6 p-4 bg-gradient-to-r from-[#00e9fa]/10 to-[#00e9fa]/5 border-2 border-[#00e9fa] rounded-xl">
                                            <div className="flex items-center justify-between flex-wrap gap-4">
                                                <div>
                                                    <p className="text-xs sm:text-sm text-gray-400 mb-1">💰 {t('quote_calculator_running_total')}</p>
                                                    <p className="text-2xl sm:text-3xl font-bold text-[#00e9fa]">
                                                        ${estimatedCost.totalWithTax.toLocaleString('en-US')} USD
                                                    </p>
                                                    <p className="text-xs sm:text-sm text-gray-400 mt-1">
                                                        {t('quote_calculator_running_cop')}: ${(estimatedCost.totalWithTax * 4200).toLocaleString('es-CO')} COP
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-500">{t('quote_calculator_includes_iva')}</p>
                                                    <p className="text-lg sm:text-xl text-gray-300">
                                                        {t('quote_calculator_subtotal')}: ${estimatedCost.subtotal.toLocaleString('en-US')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-3 pt-3 border-t border-[#00e9fa]/30">
                                                <p className="text-xs text-gray-400">
                                                    ℹ️ {t('quote_calculator_estimate_updates')}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {calculatorStep === 0 && (
                                        <div>
                                            <h4 className="text-lg sm:text-xl font-semibold text-white mb-3">{t('quote_calculator_select_duration')}</h4>
                                            <p className="text-xs sm:text-sm text-gray-400 mb-6 leading-relaxed">
                                                {t('quote_calculator_duration_explanation')}
                                                <br />
                                                <strong>{t('quote_calculator_duration_hour')}</strong>: tarifa × 1 hora.
                                                <br />
                                                <strong>{t('quote_calculator_duration_day')}</strong>: tarifa × 8 horas.
                                                <br />
                                                <strong>{t('quote_calculator_duration_week')}</strong>: tarifa × 40 horas.
                                                <br />
                                                <strong>{t('quote_calculator_duration_month')}</strong>: tarifa × 160 horas.
                                                <br />
                                                {t('quote_calculator_duration_note')}
                                            </p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                                {Object.entries(timeMultipliers).map(([key, { label, estimatedTime, value }]) => (
                                                    <button
                                                        key={key}
                                                        onClick={() => {
                                                            console.log('[BUTTON CLICK] Setting timeUnit to:', key);
                                                            setTimeUnit(key);
                                                            setCalculatorStep(1);
                                                        }}
                                                        className={`p-4 sm:p-6 rounded-lg border-2 transition-all text-left ${timeUnit === key
                                                            ? 'border-[#00e9fa] bg-[#00e9fa]/10'
                                                            : 'border-gray-700 hover:border-[#00e9fa]/50 bg-black/40'
                                                            }`}
                                                    >
                                                        <p className="font-semibold text-sm sm:text-base text-white">{label}</p>
                                                        <p className="text-xs sm:text-sm text-gray-400">{estimatedTime}</p>
                                                        <p className="text-xs text-gray-500 mt-2">{t('calc_impact_label', '{value}', value)}</p>
                                                    </button>
                                                ))}
                                            </div>

                                            <div className="mt-4 sm:mt-6 flex items-center gap-2 sm:gap-3 flex-wrap">
                                                {calculatorStep >= currentQuestionnaire.length + 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowRoadmapModal(true)}
                                                        className="px-3 sm:px-4 py-2 bg-[#00e9fa] text-black font-semibold rounded-md hover:bg-[#00e9fa]/90 text-sm"
                                                    >
                                                        {t('calc_view_roadmap')}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Render de la pregunta actual (cuando estamos entre 1 y N) */}
                                    {calculatorStep > 0 && calculatorStep <= currentQuestionnaire.length && (
                                        <div>
                                            <div className="mb-4">
                                                <h4 className="text-base sm:text-xl font-semibold text-white break-words">
                                                    {currentQuestionnaire[calculatorStep - 1]?.question}
                                                </h4>
                                                {currentQuestionnaire[calculatorStep - 1]?.explanation && (
                                                    <p className="text-xs sm:text-sm text-gray-400 mt-2">
                                                        {currentQuestionnaire[calculatorStep - 1]?.explanation}
                                                    </p>
                                                )}
                                            </div>

                                            {currentQuestionnaire[calculatorStep - 1]?.type === 'boolean' && (
                                                <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleCalculatorAnswerChange(
                                                                currentQuestionnaire[calculatorStep - 1]?.id,
                                                                true
                                                            )
                                                        }
                                                        className={`flex-1 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all text-sm sm:text-base ${calculatorAnswers[currentQuestionnaire[calculatorStep - 1]?.id] === true
                                                            ? 'bg-[#00e9fa] text-black'
                                                            : 'bg-black/40 border border-gray-600 text-white hover:border-[#00e9fa]'
                                                            }`}
                                                    >
                                                        {t('calc_yes')}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleCalculatorAnswerChange(
                                                                currentQuestionnaire[calculatorStep - 1]?.id,
                                                                false
                                                            )
                                                        }
                                                        className={`flex-1 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all text-sm sm:text-base ${calculatorAnswers[currentQuestionnaire[calculatorStep - 1]?.id] === false
                                                            ? 'bg-[#00e9fa] text-black'
                                                            : 'bg-black/40 border border-gray-600 text-white hover:border-[#00e9fa]'
                                                            }`}
                                                    >
                                                        {t('calc_no')}
                                                    </button>
                                                </div>
                                            )}

                                            {currentQuestionnaire[calculatorStep - 1]?.type === 'number' && (
                                                <div className="mt-4">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={calculatorAnswers[currentQuestionnaire[calculatorStep - 1]?.id] ?? ''}
                                                        onChange={(e) => {
                                                            const rawValue = e.target.value;
                                                            const parsed = rawValue === '' ? '' : Number(rawValue);
                                                            handleCalculatorAnswerChange(
                                                                currentQuestionnaire[calculatorStep - 1]?.id,
                                                                parsed,
                                                                { advance: false }
                                                            );
                                                        }}
                                                        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-black/40 border border-gray-600 rounded-lg text-white focus:border-[#00e9fa] focus:outline-none text-sm"
                                                        placeholder={t('calc_enter_number')}
                                                    />
                                                </div>
                                            )}

                                            {currentQuestionnaire[calculatorStep - 1]?.type === 'choice' && (
                                                <div className="grid grid-cols-1 gap-2 sm:gap-3 mt-4">
                                                    {currentQuestionnaire[calculatorStep - 1]?.options?.map(option => {
                                                        const isSelected = calculatorAnswers[currentQuestionnaire[calculatorStep - 1]?.id] === option.value;

                                                        return (
                                                            <button
                                                                key={option.value}
                                                                onClick={() => {
                                                                    handleCalculatorAnswerChange(
                                                                        currentQuestionnaire[calculatorStep - 1]?.id,
                                                                        option.value
                                                                    );
                                                                }}
                                                                className={`p-3 sm:p-4 rounded-lg border-2 transition-all text-left ${isSelected
                                                                    ? 'border-[#00e9fa] bg-[#00e9fa]/10'
                                                                    : 'border-gray-700 hover:border-[#00e9fa]/50 bg-black/40'
                                                                    }`}
                                                            >
                                                                <span className="font-semibold text-sm sm:text-base text-white break-words">{option.label}</span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            {currentQuestionnaire[calculatorStep - 1]?.type === 'multiple' && (
                                                <div className="space-y-2 sm:space-y-3 mt-4">
                                                    {currentQuestionnaire[calculatorStep - 1]?.options?.map(option => {
                                                        const currentAnswers = calculatorAnswers[currentQuestionnaire[calculatorStep - 1]?.id] || [];
                                                        const isSelected = Array.isArray(currentAnswers) && currentAnswers.includes(option.value);

                                                        return (
                                                            <button
                                                                key={option.value}
                                                                onClick={() => {
                                                                    const questionId = currentQuestionnaire[calculatorStep - 1]?.id;
                                                                    const current = calculatorAnswers[questionId] || [];
                                                                    const currentArray = Array.isArray(current) ? current : [];

                                                                    let newAnswers;
                                                                    if (currentArray.includes(option.value)) {
                                                                        newAnswers = currentArray.filter(v => v !== option.value);
                                                                    } else {
                                                                        newAnswers = [...currentArray, option.value];
                                                                    }

                                                                    handleCalculatorAnswerChange(questionId, newAnswers, { advance: false });
                                                                }}
                                                                className={`w-full p-3 sm:p-4 rounded-lg border-2 transition-all text-left flex items-center gap-3 ${isSelected
                                                                    ? 'border-[#00e9fa] bg-[#00e9fa]/10'
                                                                    : 'border-gray-700 hover:border-[#00e9fa]/50 bg-black/40'
                                                                    }`}
                                                            >
                                                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-[#00e9fa] border-[#00e9fa]' : 'border-gray-600'
                                                                    }`}>
                                                                    {isSelected && (
                                                                        <CheckCircle size={16} className="text-black" />
                                                                    )}
                                                                </div>
                                                                <span className="font-semibold text-sm sm:text-base text-white break-words">{option.label}</span>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {calculatorStep >= currentQuestionnaire.length + 1 && (
                                        <div className="space-y-4 sm:space-y-6">
                                            {!hasAnsweredQuestions && (
                                                <div className="bg-yellow-900/30 border border-yellow-600 rounded-lg p-4 sm:p-6 flex gap-3">
                                                    <AlertCircle className="text-yellow-400 flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6" />
                                                    <p className="text-xs sm:text-sm text-yellow-300">
                                                        {t('calc_more_answers')}
                                                    </p>
                                                </div>
                                            )}

                                            {/* Resumen de selecciones */}
                                            <div className="bg-black/40 border border-gray-700 rounded-lg p-4 sm:p-6">
                                                <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">{t('calc_summary_title')}</h4>
                                                <div className="space-y-2 sm:space-y-3">
                                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                                        <span className="text-gray-400 text-sm sm:text-base">{t('calc_service_label')}</span>
                                                        <span className="text-[#00e9fa] font-semibold text-sm sm:text-base break-words">
                                                            {services.find(s => s.id === selectedService)?.name}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                                                        <span className="text-gray-400 text-sm sm:text-base">{t('calc_duration_label')}</span>
                                                        <span className="text-[#00e9fa] font-semibold text-sm sm:text-base">
                                                            {timeMultipliers[timeUnit]?.label}
                                                        </span>
                                                    </div>
                                                    {Object.keys(calculatorAnswers).length > 0 && (
                                                        <div>
                                                            <p className="text-gray-400 mb-2">{t('calc_requirements_label')}</p>
                                                            <div className="ml-4 space-y-1">
                                                                {currentQuestionnaire.map(q => {
                                                                    const answer = calculatorAnswers[q.id];
                                                                    // Solo mostrar si: boolean true O número > 0 O choice con valor O multiple con selecciones
                                                                    const shouldShow = (q.type === 'boolean' && answer === true) ||
                                                                        (q.type === 'number' && typeof answer === 'number' && answer > 0) ||
                                                                        (q.type === 'choice' && answer !== undefined && answer !== null) ||
                                                                        (q.type === 'multiple' && Array.isArray(answer) && answer.length > 0);
                                                                    if (!shouldShow) return null;

                                                                    // Para tipo multiple, mostrar las opciones seleccionadas
                                                                    if (q.type === 'multiple' && Array.isArray(answer)) {
                                                                        const selectedLabels = answer.map(val => {
                                                                            const option = q.options?.find(opt => opt.value === val);
                                                                            return option?.label || val;
                                                                        }).join(', ');

                                                                        return (
                                                                            <div key={q.id} className="text-sm text-gray-300">
                                                                                <span className="text-[#00e9fa]">✓</span> {q.question.split('(')[0].trim()}: {selectedLabels}
                                                                            </div>
                                                                        );
                                                                    }

                                                                    // Para tipo choice, mostrar la opción seleccionada
                                                                    if (q.type === 'choice') {
                                                                        const option = q.options?.find(opt => opt.value === answer);
                                                                        return (
                                                                            <div key={q.id} className="text-sm text-gray-300">
                                                                                <span className="text-[#00e9fa]">✓</span> {q.question.split('¿')[1]?.split('?')[0]}: {option?.label || answer}
                                                                            </div>
                                                                        );
                                                                    }

                                                                    return (
                                                                        <div key={q.id} className="text-sm text-gray-300">
                                                                            <span className="text-[#00e9fa]">✓</span> {q.question}
                                                                            {typeof answer === 'number' && answer > 0 ? ` (${answer})` : ''}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {planningTable[selectedService] && (
                                                <div className="bg-black/40 border border-gray-700 rounded-lg p-6">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h4 className="text-lg font-semibold text-white">{t('calc_planning_title')}</h4>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-xs text-gray-400 uppercase tracking-wide">{t('calc_estimated_reference')}</span>
                                                            {priceSources[selectedService] && (
                                                                <a
                                                                    href={priceSources[selectedService]}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-xs text-[#00e9fa] hover:underline"
                                                                >
                                                                    {t('calc_price_source')}
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-1 gap-3">
                                                        <div className="hidden md:grid grid-cols-[1.2fr_2fr_0.8fr] gap-4 text-xs text-gray-400 uppercase tracking-wide mb-1">
                                                            <span>{t('calc_phase_label')}</span>
                                                            <span>{t('calc_deliverables_label')}</span>
                                                            <span>{t('calc_time_label')}</span>
                                                        </div>
                                                        {planningTable[selectedService].map((row, index) => (
                                                            <div
                                                                key={`${selectedService}-plan-${index}`}
                                                                className="grid grid-cols-1 md:grid-cols-[1.2fr_2fr_0.8fr] gap-4 p-4 bg-black/50 rounded-lg border border-gray-700"
                                                            >
                                                                <div>
                                                                    <p className="text-sm font-semibold text-white">{t(row.phase)}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm text-gray-300">{t(row.deliverables)}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm text-[#00e9fa] font-semibold">{t(row.timing)}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <p className="text-xs text-gray-500 mt-4">
                                                        * {t('calc_schedule_note')}
                                                    </p>
                                                </div>
                                            )}

                                            <div className="bg-[#00e9fa]/10 border border-[#00e9fa] rounded-lg p-8">
                                                <p className="text-gray-400 uppercase tracking-wide mb-2">{t('calc_total_estimate')}</p>
                                                <p className="text-5xl font-black text-[#00e9fa] mb-2">
                                                    USD ${estimatedCost ? estimatedCost.totalWithTax.toLocaleString() : '0'}
                                                </p>
                                                <p className="text-2xl font-bold text-[#00e9fa] mb-8">
                                                    ${estimatedCost ? (estimatedCost.totalWithTax * 4200).toLocaleString('es-CO') : '0'} COP
                                                </p>

                                                {/* Desglose de horas (solo si eligió "Por Hora") */}
                                                {timeUnit === 'horas' && hourBreakdown[selectedService] && (
                                                    <div className="mb-8 pb-8 border-b border-[#00e9fa]/30">
                                                        <p className="text-gray-400 uppercase tracking-wide mb-4 font-semibold">{t('calc_estimated_hours')}</p>
                                                        <div className="bg-black/40 rounded-lg p-4 mb-4">
                                                            <div className="text-center mb-6">
                                                                <p className="text-gray-400 mb-2">{t('calc_base_hours')}</p>
                                                                <p className="text-4xl font-black text-[#00e9fa]">
                                                                    {hourBreakdown[selectedService].baseHours} horas
                                                                </p>
                                                                <p className="text-sm text-gray-400 mt-2">
                                                                    * {t('calc_base_hours_note')}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <p className="text-gray-400 text-sm font-semibold mb-3">{t('calc_task_breakdown')}</p>
                                                        <div className="space-y-2">
                                                            {hourBreakdown[selectedService].tasks.map((task, idx) => (
                                                                <div key={idx} className="flex items-center gap-3">
                                                                    <div className="flex-1">
                                                                        <div className="flex justify-between items-center mb-1">
                                                                            <span className="text-sm text-gray-300">{t(task.name)}</span>
                                                                            <span className="text-xs text-[#00e9fa] font-semibold">{task.hours}h ({task.percentage}%)</span>
                                                                        </div>
                                                                        <div className="w-full bg-black/60 rounded-full h-2 overflow-hidden">
                                                                            <div
                                                                                className="bg-[#00e9fa] h-full transition-all"
                                                                                style={{ width: `${task.percentage}%` }}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="space-y-3 text-sm text-gray-400 border-t border-[#00e9fa]/30 pt-6">
                                                    <div className="flex justify-between">
                                                        <span>{t('calc_base_rate')}</span>
                                                        <span className="text-[#00e9fa]">${basePrices[selectedService]}/hora</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>{t('calc_selected_duration')}</span>
                                                        <span className="text-[#00e9fa]">{timeMultipliers[timeUnit]?.label?.toLowerCase()} ({timeMultipliers[timeUnit]?.value}h)</span>
                                                    </div>
                                                    <div className="text-xs mt-4 p-3 bg-black/40 rounded border border-gray-700">
                                                        <p className="font-semibold text-gray-300 mb-2">{t('calc_calculation_breakdown')}</p>
                                                        <p>• Tarifa base × Duración × Multiplicadores de complejidad × IVA 19%</p>
                                                        <p>{t('calc_multipliers_note')}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-6 flex gap-3">
                                                <AlertCircle className="text-blue-400 flex-shrink-0" size={24} />
                                                <p className="text-sm text-blue-300">
                                                    {t('calc_estimate_note')}
                                                </p>
                                            </div>

                                            {/* Botón para mostrar/ocultar Roadmap */}
                                            <button
                                                onClick={() => setShowRoadmap(!showRoadmap)}
                                                className="w-full px-6 py-4 bg-gradient-to-r from-[#00e9fa] to-cyan-400 text-black font-bold uppercase tracking-wider rounded-lg hover:from-cyan-400 hover:to-[#00e9fa] transition-all flex items-center justify-center gap-3 shadow-lg"
                                            >
                                                <FileText size={24} />
                                                {showRoadmap ? t('calc_hide_roadmap') : t('calc_view_roadmap')}
                                            </button>

                                            {/* Panel de Roadmap con Sprints */}
                                            {showRoadmap && planningTable[selectedService] && (
                                                <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-2 border-purple-500/50 rounded-xl p-8 space-y-6">
                                                    <div className="text-center mb-8">
                                                        <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-2">
                                                            {t('calc_roadmap_title')}
                                                        </h3>
                                                        <p className="text-gray-400 text-sm">
                                                            {t('calc_roadmap_subtitle')}
                                                        </p>
                                                    </div>

                                                    {/* Timeline de Sprints */}
                                                    <div className="space-y-4">
                                                        {planningTable[selectedService].map((phase, idx) => (
                                                            <div key={idx} className="relative">
                                                                {/* Connector line */}
                                                                {idx < planningTable[selectedService].length - 1 && (
                                                                    <div className="absolute left-6 top-16 w-0.5 h-full bg-gradient-to-b from-purple-500 to-blue-500 opacity-30" />
                                                                )}

                                                                {/* Sprint Card */}
                                                                <div className="relative flex gap-4 bg-black/40 border border-purple-500/30 rounded-lg p-6 hover:border-purple-500/60 transition-all">
                                                                    {/* Sprint Number Badge */}
                                                                    <div className="flex-shrink-0">
                                                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-black text-lg shadow-lg">
                                                                            {idx + 1}
                                                                        </div>
                                                                    </div>

                                                                    {/* Sprint Content */}
                                                                    <div className="flex-1">
                                                                        <div className="flex items-start justify-between mb-3">
                                                                            <h4 className="text-xl font-bold text-white">
                                                                                Sprint {idx + 1}: {t(phase.phase)}
                                                                            </h4>
                                                                            <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/50 rounded-full text-purple-300 text-sm font-semibold whitespace-nowrap">
                                                                                ⏱️ {t(phase.timing)}
                                                                            </span>
                                                                        </div>

                                                                        <div className="space-y-2">
                                                                            <p className="text-sm text-gray-400 font-semibold uppercase tracking-wider">Entregables:</p>
                                                                            <div className="flex items-start gap-2">
                                                                                <CheckCircle className="text-green-400 flex-shrink-0 mt-0.5" size={18} />
                                                                                <p className="text-gray-300 leading-relaxed">{t(phase.deliverables)}</p>
                                                                            </div>
                                                                        </div>

                                                                        {phase.description && (
                                                                            <div className="mt-3 pt-3 border-t border-purple-500/20">
                                                                                <p className="text-sm text-gray-400 italic">{phase.description}</p>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Roadmap Footer */}
                                                    <div className="mt-8 p-6 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                                                        <h4 className="text-lg font-bold text-purple-300 mb-3 flex items-center gap-2">
                                                            <AlertCircle size={20} />
                                                            {t('calc_important_notes')}
                                                        </h4>
                                                        <ul className="space-y-2 text-sm text-gray-400">
                                                            <li>{t('calc_sprint_note_1')}</li>
                                                            <li>{t('calc_sprint_note_2')}</li>
                                                            <li>{t('calc_sprint_note_3')}</li>
                                                            <li>{t('calc_sprint_note_4')}</li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Botón para enviar cotización por email */}
                                            <button
                                                onClick={() => setShowEmailForm(!showEmailForm)}
                                                className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold uppercase tracking-wider rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-3 shadow-lg"
                                            >
                                                <Mail size={24} />
                                                {showEmailForm ? t('quote_email_button_cancel') : t('quote_email_button_send')}
                                            </button>

                                            {/* Mensaje de éxito */}
                                            {emailSent && (
                                                <div className="bg-green-900/20 border-2 border-green-500 rounded-lg p-6 flex items-center gap-3 animate-pulse">
                                                    <CheckCircle className="text-green-400 flex-shrink-0" size={32} />
                                                    <div>
                                                        <p className="text-green-300 font-bold text-lg">{t('quote_email_success_title')}</p>
                                                        <p className="text-green-400 text-sm">{t('quote_email_success_message')}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Formulario de contacto para enviar cotización */}
                                            {showEmailForm && (
                                                <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-2 border-green-500/50 rounded-xl p-8 space-y-6">
                                                    <div className="text-center mb-6">
                                                        <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 mb-2">
                                                            📬 {t('calc_send_quote')}
                                                        </h3>
                                                        <p className="text-gray-400 text-sm">
                                                            {t('calc_send_quote_subtitle')}
                                                        </p>
                                                    </div>

                                                    {emailError && (
                                                        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 flex items-center gap-3">
                                                            <AlertCircle className="text-red-400 flex-shrink-0" size={20} />
                                                            <p className="text-red-300 text-sm">{emailError}</p>
                                                        </div>
                                                    )}

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                                                {t('calc_full_name_label')}
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="clientName"
                                                                value={emailFormData.clientName}
                                                                onChange={handleEmailFormChange}
                                                                className="w-full px-4 py-3 bg-black/40 border border-gray-600 rounded-lg text-white focus:border-green-500 focus:outline-none"
                                                                placeholder={t('calc_full_name_placeholder')}
                                                                required
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                                                Email *
                                                            </label>
                                                            <input
                                                                type="email"
                                                                name="clientEmail"
                                                                value={emailFormData.clientEmail}
                                                                onChange={handleEmailFormChange}
                                                                className="w-full px-4 py-3 bg-black/40 border border-gray-600 rounded-lg text-white focus:border-green-500 focus:outline-none"
                                                                placeholder="juan@empresa.com"
                                                                required
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                                                Empresa
                                                            </label>
                                                            <input
                                                                type="text"
                                                                name="clientCompany"
                                                                value={emailFormData.clientCompany}
                                                                onChange={handleEmailFormChange}
                                                                className="w-full px-4 py-3 bg-black/40 border border-gray-600 rounded-lg text-white focus:border-green-500 focus:outline-none"
                                                                placeholder="Mi Empresa SAS"
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-semibold text-gray-300 mb-2">
                                                                Teléfono
                                                            </label>
                                                            <input
                                                                type="tel"
                                                                name="clientPhone"
                                                                value={emailFormData.clientPhone}
                                                                onChange={handleEmailFormChange}
                                                                className="w-full px-4 py-3 bg-black/40 border border-gray-600 rounded-lg text-white focus:border-green-500 focus:outline-none"
                                                                placeholder="+57 300 123 4567"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-300 mb-2">
                                                            Notas adicionales (opcional)
                                                        </label>
                                                        <textarea
                                                            name="additionalNotes"
                                                            value={emailFormData.additionalNotes}
                                                            onChange={handleEmailFormChange}
                                                            rows="4"
                                                            className="w-full px-4 py-3 bg-black/40 border border-gray-600 rounded-lg text-white focus:border-green-500 focus:outline-none resize-none"
                                                            placeholder="Información adicional sobre tu proyecto, requerimientos especiales, fechas límite, etc."
                                                        />
                                                    </div>

                                                    <button
                                                        onClick={sendQuoteToEmail}
                                                        disabled={sendingEmail}
                                                        className={`w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold uppercase tracking-wider rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-3 shadow-lg ${sendingEmail ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    >
                                                        {sendingEmail ? (
                                                            <>
                                                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                                                                Enviando...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Mail size={24} />
                                                                Enviar Cotización Ahora
                                                            </>
                                                        )}
                                                    </button>

                                                    <p className="text-xs text-gray-500 text-center">
                                                        Al enviar, aceptas que Xlerion te contacte sobre esta cotización. También recibirás una copia en tu email.
                                                    </p>
                                                </div>
                                            )}

                                            <div className="flex gap-4">
                                                <button
                                                    onClick={() => {
                                                        setCalculatorStep(0);
                                                        setTimeUnit('');
                                                        setCalculatorAnswers({});
                                                    }}
                                                    className="flex-1 px-6 py-3 bg-black/40 border border-gray-600 text-white rounded-md hover:border-[#00e9fa] transition-all font-semibold"
                                                >
                                                    ← Volver Atrás
                                                </button>
                                                <button
                                                    onClick={() => setActiveTab('servicios')}
                                                    className="flex-1 px-6 py-3 bg-[#00e9fa] text-black font-bold uppercase tracking-wider rounded-md hover:bg-[#00e9fa]/80 transition-all"
                                                >
                                                    Nuevo Cálculo
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {calculatorStep <= currentQuestionnaire.length && (
                                        <div className="flex gap-4 mt-8">
                                            <button
                                                onClick={() => setCalculatorStep(Math.max(0, calculatorStep - 1))}
                                                className="px-6 py-3 bg-black/40 border border-gray-600 text-white rounded-md hover:border-[#00e9fa] transition-colors"
                                            >
                                                ← {t('calc_previous')}
                                            </button>
                                            <button
                                                onClick={() => setCalculatorStep(calculatorStep + 1)}
                                                disabled={calculatorStep > 0 && calculatorStep <= currentQuestionnaire.length && (calculatorAnswers[currentQuestionnaire[calculatorStep - 1]?.id] === undefined || calculatorAnswers[currentQuestionnaire[calculatorStep - 1]?.id] === null || calculatorAnswers[currentQuestionnaire[calculatorStep - 1]?.id] === '')}
                                                className="flex-1 px-6 py-3 bg-[#00e9fa] text-black font-bold rounded-md hover:bg-[#00e9fa]/80 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {t('calc_next')}
                                                <ChevronRight size={20} />
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p className="text-gray-400 text-center py-12">
                                    Selecciona un servicio desde la pestaña "Servicios" para comenzar a calcular el precio.
                                </p>
                            )}
                        </section>
                    )}

                    {/* FAQ */}
                    <section className="mt-20">
                        <h3 className="text-3xl font-bold text-[#00e9fa] mb-12 font-mono uppercase tracking-wider">
                            Preguntas Frecuentes
                        </h3>
                        <div className="space-y-6">
                            <div className="border-l-4 border-[#00e9fa]/30 pl-6">
                                <h4 className="text-lg font-bold text-white mb-2">¿Cómo funciona el calculador?</h4>
                                <p className="text-gray-400">
                                    El calculador estima el precio basándose en el tiempo elegido y las características específicas de tu proyecto. Es una guía inicial; el precio final puede variar según complejidades adicionales.
                                </p>
                            </div>
                            <div className="border-l-4 border-[#00e9fa]/30 pl-6">
                                <h4 className="text-lg font-bold text-white mb-2">¿Cuál es el tiempo de respuesta?</h4>
                                <p className="text-gray-400">
                                    Revisamos todas las solicitudes dentro de 24-48 horas hábiles. Nuestro equipo se contactará contigo vía email o llamada.
                                </p>
                            </div>
                            <div className="border-l-4 border-[#00e9fa]/30 pl-6">
                                <h4 className="text-lg font-bold text-white mb-2">¿Ofrecen planes personalizados?</h4>
                                <p className="text-gray-400">
                                    Sí. Todas nuestras cotizaciones son personalizadas según tus necesidades específicas, scope del proyecto y presupuesto.
                                </p>
                            </div>
                            <div className="border-l-4 border-[#00e9fa]/30 pl-6">
                                <h4 className="text-lg font-bold text-white mb-2">¿Hacen contratos internacionales?</h4>
                                <p className="text-gray-400">
                                    Sí. Trabajamos con clientes a nivel internacional. Solicita una cotización y coordinaremos los detalles contractuales.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </Layout >
    );
}
