title=blog posts in grafana
intro=in case you missed RSS, you might enjoy another way of reading blog posts
tags=grafana fun
style=
styles=
created=2024-11-08
PROCESSOR=cmark-gfm --unsafe -e footnotes -e table -e strikethrough -e tasklist --strikethrough-double-tilde

Apparently, grafana includes [HTML parser][x].
So I made a simple config to parse main page of this blog.
Check it out [here][y].
Unfortunatelly, links are not supprted.

Exporting this data to RSS is left as exercise ti the reader.

[x]: https://grafana.com/grafana/plugins/yesoreyeram-infinity-datasource/
[y]: https://play.grafana.org/explore?schemaVersion=1&panes=%7B%22s9j%22:%7B%22datasource%22:%22infinity-universal%22,%22queries%22:%5B%7B%22refId%22:%22A%22,%22datasource%22:%7B%22type%22:%22yesoreyeram-infinity-datasource%22,%22uid%22:%22infinity-universal%22%7D,%22type%22:%22html%22,%22source%22:%22url%22,%22format%22:%22dataframe%22,%22url%22:%22https:%2F%2Falexey.shpakovsky.ru%2Fen%2F%22,%22url_options%22:%7B%22method%22:%22GET%22,%22data%22:%22%22,%22params%22:%5B%5D,%22headers%22:%5B%5D%7D,%22root_selector%22:%22main%20ol%20li%22,%22columns%22:%5B%7B%22text%22:%22title%22,%22selector%22:%22.title%22,%22type%22:%22string%22%7D,%7B%22text%22:%22created%22,%22selector%22:%22time:nth-child%281%29%22,%22type%22:%22string%22%7D,%7B%22text%22:%22modified%22,%22selector%22:%22time:nth-child%282%29%22,%22type%22:%22string%22%7D,%7B%22text%22:%22intro%22,%22selector%22:%22.intro%22,%22type%22:%22string%22%7D%5D,%22filters%22:%5B%5D,%22global_query_id%22:%22%22%7D%5D,%22range%22:%7B%22from%22:%22now-1h%22,%22to%22:%22now%22%7D%7D%7D&orgId=1
