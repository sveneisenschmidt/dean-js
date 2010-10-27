<?php

$content  = '';
$iterator = new RecursiveIteratorIterator(
                new RecursiveDirectoryIterator(realpath('../../../../src/'),
                        RecursiveDirectoryIterator::SKIP_DOTS));

foreach($iterator as $file) {
    if($file->isDir()) continue;
    if(!(bool)preg_match('/^(.*).js/', $file->getFileName())) continue;

    $content .= file_get_contents($file->getRealPath()) . "\n";
}

header("Content-type: application/x-javascript");

$content = preg_replace('!/\*.*?\*/!s', '', $content);
$content = preg_replace('/\n\s*\n/', "\n", $content);
$content = preg_replace('/\n\n/', "\n", $content);

print $content;





