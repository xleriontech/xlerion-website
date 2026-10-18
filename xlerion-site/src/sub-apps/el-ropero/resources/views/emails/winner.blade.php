<html>
<body>
  <p>Hola,</p>
  <p>Has ganado la subasta! Detalles de la transacción:</p>
  <ul>
    <li>ID transacción: {{ $tx->id }}</li>
    <li>Monto: {{ $tx->amount }}</li>
  </ul>
  <p>En breve recibirás instrucciones para el pago (modo sandbox).</p>
  <p>Saludos,<br/>El Ropero</p>
</body>
</html>
