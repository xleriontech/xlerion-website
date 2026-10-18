<?php
namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;

class GenerateThumbnails implements ShouldQueue
{
    use InteractsWithQueue, Queueable, SerializesModels;

    public $imagePath;

    public function __construct($imagePath)
    {
        $this->imagePath = $imagePath;
    }

    public function handle()
    {
        // Placeholder: in CI/production install intervention/image and implement resizing.
        try {
            $disk = Storage::disk('s3');
            $contents = $disk->get($this->imagePath);
            // Generate thumbnail variants (small: 300px, medium: 800px)
            // For now we re-upload same file as placeholders with suffixes.
            $dir = pathinfo($this->imagePath, PATHINFO_DIRNAME);
            $file = pathinfo($this->imagePath, PATHINFO_BASENAME);
            $disk->put("{$dir}/thumb_{$file}", $contents);
            $disk->put("{$dir}/medium_{$file}", $contents);
        } catch (\Exception $e) {
            \Log::error('Thumbnail generation failed: '.$e->getMessage());
        }
    }
}
