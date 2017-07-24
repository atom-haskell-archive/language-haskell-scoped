gawk -F\; '{if($3~"^[SP]") print $1;}' /usr/share/unicode-data/UnicodeData.txt \
| awk \
  'BEGIN {prev=0; start=0;};
  {
    val=strtonum("0x"$0);
    char = sprintf("%c", val);
    if (val < 128 && char!~/[(),;\[\]`\{\}_"'"'"']/) {
      if (val-prev>1) {
	if (start == prev) {
          print sprintf("\\%c",start);
	} else {
          print sprintf("\\%c-\\%c",start,prev);
	}
        start=val;
      }
      prev=val
    }
  }' \
| tail -n+2 | tr -d '\n' \
| sed -r 's~^(.*)$~/[\1]+/ug~'
