Application.class_eval do
  
  if environment == :development
    
    get '/spec/js' do
      site = ABPlugin::Config.site
      categories = ABPlugin::Config.categories
      
      ABPlugin::Config.categories [
        {
          :name => 'Category',
          :tests => [
            {
              :id => 1,
              :name => 'Test',
              :variants => [
                { :id => 2, :name => 'v1' },
                { :id => 3, :name => 'v2' },
                { :id => 4, :name => 'v3' }
              ]
            }
          ]
        }
      ]
      
      ABPlugin::API.spec_js_setup
      
      haml :'spec/js', :layout => false
      
      ABPlugin::Config.site site
      ABPlugin::Config.categories categories
    end
  end
end