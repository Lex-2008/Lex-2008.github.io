size=100
ext=(jpg jpeg JPG JPEG)
for dir in `find -type d`; do
	echo "=== $dir ==="
	for a in ${ext[*]}; do ls $dir/*.$a >>$dir.list; done
	convert -strip -thumbnail ${size}x${size} -raise 3x3 -gravity center -background '#ff000000' -extent ${size}x${size} -append @$dir.list $dir.png
done
