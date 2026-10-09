Add-Type -AssemblyName System.Drawing

$outDir = Join-Path (Split-Path -Parent $PSScriptRoot) 'public'

# Red ring + dot on black, using the site palette (#000000 / #ff1e38).
# Full-bleed black square (iOS and Android apply their own mask).
# Ring + stroke stay inside the 80% maskable safe zone.
$black = [System.Drawing.ColorTranslator]::FromHtml('#000000')
$red = [System.Drawing.ColorTranslator]::FromHtml('#ff1e38')
$redDot = [System.Drawing.ColorTranslator]::FromHtml('#ff2d46')

function New-Icon([int]$size, [string]$fileName) {
    $bmp = New-Object System.Drawing.Bitmap $size, $size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.Clear($black)

    $c = [single]($size / 2)
    $ringR = [single]($size * 0.27)
    $stroke = [single]($size * 0.075)
    $dotR = [single]($size * 0.085)

    $pen = New-Object System.Drawing.Pen $red, $stroke
    $g.DrawEllipse($pen, [single]($c - $ringR), [single]($c - $ringR), [single]($ringR * 2), [single]($ringR * 2))

    $dotBrush = New-Object System.Drawing.SolidBrush $redDot
    $g.FillEllipse($dotBrush, [single]($c - $dotR), [single]($c - $dotR), [single]($dotR * 2), [single]($dotR * 2))

    $outFile = Join-Path $outDir $fileName
    $bmp.Save($outFile, [System.Drawing.Imaging.ImageFormat]::Png)

    $pen.Dispose()
    $dotBrush.Dispose()
    $g.Dispose()
    $bmp.Dispose()
    Write-Output "saved $outFile"
}

New-Icon 180 'apple-touch-icon.png'
New-Icon 192 'icon-192.png'
New-Icon 512 'icon-512.png'