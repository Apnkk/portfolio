Add-Type -AssemblyName System.Drawing

$width = 1200
$height = 630
$outDir = Join-Path (Split-Path -Parent $PSScriptRoot) 'public'
$outFile = Join-Path $outDir 'og-image.png'

$bmp = New-Object System.Drawing.Bitmap $width, $height
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

$black = [System.Drawing.ColorTranslator]::FromHtml('#000000')
$red = [System.Drawing.ColorTranslator]::FromHtml('#ff1e38')
$cream = [System.Drawing.ColorTranslator]::FromHtml('#f5f3ef')
$dim = [System.Drawing.ColorTranslator]::FromHtml('#9a958d')

$g.Clear($black)

# Soft red glow, top-right
$glowBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(38, 255, 30, 56))
$g.FillEllipse($glowBrush, 620, -220, 820, 820)
$glowBrush2 = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(22, 255, 30, 56))
$g.FillEllipse($glowBrush2, 760, -80, 540, 540)

$creamBrush = New-Object System.Drawing.SolidBrush $cream
$redBrush = New-Object System.Drawing.SolidBrush $red
$dimBrush = New-Object System.Drawing.SolidBrush $dim

$px = [System.Drawing.GraphicsUnit]::Pixel
$bold = [System.Drawing.FontStyle]::Bold
$regular = [System.Drawing.FontStyle]::Regular

$fontKicker = New-Object System.Drawing.Font('Consolas', 24, $regular, $px)
$fontTitle = New-Object System.Drawing.Font('Segoe UI', 190, $bold, $px)
$fontSub = New-Object System.Drawing.Font('Segoe UI', 44, $regular, $px)
$fontMeta = New-Object System.Drawing.Font('Consolas', 26, $regular, $px)

# Red accent bar + kicker
$g.FillRectangle($redBrush, 80, 96, 64, 6)
$g.DrawString('PORTFOLIO / 2026', $fontKicker, $dimBrush, 80, 116)

# Title + subtitle
$g.DrawString('ARES', $fontTitle, $creamBrush, 66, 190)
$g.DrawString('Full-Stack Developer & Creative Builder', $fontSub, $creamBrush, 80, 430)

# Real project names only
$g.DrawString('Z-Flix  ·  ShopCore  ·  Spoti Liquid Glass', $fontMeta, $redBrush, 80, 520)

$bmp.Save($outFile, [System.Drawing.Imaging.ImageFormat]::Png)

$g.Dispose()
$bmp.Dispose()
Write-Output "saved $outFile"