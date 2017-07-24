PRINTFMT='\\u{%X}'
FLAGS='u'
if [[ "$1" == '-a' ]]; then
  ASCII='val < 128 && '
  PRINTFMT='\\%c'
  FLAGS=''
  shift
fi
gawk -F\; '{if($3~"^[SP]") print $1;}' /usr/share/unicode-data/UnicodeData.txt \
| awk \
  '{
    val=strtonum("0x"$0);
    if (NR == 1) { prev=val; start=val; }
    char = sprintf("%c", val);
    if ('"$ASCII"' char!~/[(),;\[\]`\{\}_"'"'"']/) {
      if (val-prev>1) {
	if (start == prev) {
          print sprintf("'"$PRINTFMT"'",start);
	} else {
          print sprintf("'"$PRINTFMT"'-'"$PRINTFMT"'",start,prev);
	}
        start=val;
      }
      prev=val
    }
  }' \
| tr -d '\n' \
| sed -r 's~^(.*)$~/'$1'[\1]+'$2'/'"${FLAGS}$3"'\n~'
