Application.class_eval do
  
  if environment == :development
    
    get '/spec/js' do
      ABPlugin::API.spec_js_setup
      haml :'spec/js', :layout => false
    end
  end
end