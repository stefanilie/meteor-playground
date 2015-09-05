ServiceConfiguration.configurations.remove({
  service: "instagram"
});
ServiceConfiguration.configurations.insert({
  service: "instagram",
  clientId: "41c1a9bf8c77432ab6677f629b9272a8",
  scope: 'basic',
  secret: "0919733b19e64462b2b509051f58adab"
});
ServiceConfiguration.configurations.remove({
  service: "twitter"
});
ServiceConfiguration.configurations.insert({
  service: "twitter",
  consumerKey: "1P5P6iQfU5Oo7APMXlht9K6eC",
  secret: "3q3QME7rlcs9Pxk3kX1OUKBddmY21RcSdo9p4yed0cUW9ihcZP",
  loginStyle: "popup"
})
