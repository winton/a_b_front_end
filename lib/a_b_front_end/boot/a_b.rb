Application.class_eval do
  include ABPlugin::Adapters::Sinatra
  ABPlugin.new
end