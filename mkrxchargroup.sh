gawk -F\; '{if($3~"^[SP]") print $1;}' /usr/share/unicode-data/UnicodeData.txt \
| awk \
  'BEGIN {prev=0; start=0;};
  {
    val=strtonum("0x"$0);
    if (val-prev>1) {
      print sprintf("\\u{%x}-\\u{%x}",start,prev);
      start=val;
    }
    prev=val
  }' \
| tail -n+2 | tr -d '\n' \
| sed -r 's~^(.*)$~module.exports=/(?:(?![(),;\\[\\]`\\{\\}_"'"'"'])[\1])+/u'
