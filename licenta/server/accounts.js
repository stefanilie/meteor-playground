ServiceConfiguration.configurations.remove({
  service: "instagram"
});
ServiceConfiguration.configurations.insert({
  service: "instagram",
  scope: 'public_content',
  clientId: "881bb81f9c8049c2b7d1618df9f94ce0",
  secret: "7091db015eed4af8a5b373d8b0089491"
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
