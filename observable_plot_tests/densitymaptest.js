Plot.plot({
    projection: "albers",
    color: {scheme: "YlGnBu"},
    style: "overflow: visible;",
    marks: [
      Plot.density(walmarts, {x: "longitude", y: "latitude", bandwidth: 10, fill: "density"}),
      Plot.geo(statemesh, {strokeOpacity: 0.3}),
      Plot.geo(nation),
      Plot.dot(walmarts, {x: "longitude", y: "latitude", r: 1, fill: "currentColor"})
    ]
  })

  us = FileAttachment("us-counties-10m.json").json()

  nation = topojson.feature(us, us.objects.nation)

  statemesh = topojson.mesh(us, us.objects.states)

  walmarts = FileAttachment("walmarts.tsv").tsv({typed: true})