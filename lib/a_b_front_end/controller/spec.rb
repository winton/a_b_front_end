Application.class_eval do
  
  if environment == :development
    
    get '/spec/fake_data' do
      response.delete_cookie('a_b')
      response.delete_cookie('a_b_i')
      
      if request.cookies['category_name'] && request.cookies['site_name'] && request.cookies['test_name']
        categories = ABPlugin::Config.categories
        site = ABPlugin.site request.cookies['site_name']
        if site != false
          @category = request.cookies['category_name']
          @test = request.cookies['test_name']
          ABPlugin::Config.categories site['categories']
        end
        response.delete_cookie('category_name')
        response.delete_cookie('site_name')
        response.delete_cookie('test_name')
      end
      
      output = haml :'spec/fake_data', :layout => false
      ABPlugin::Config.categories categories
      
      output
    end
    
    get '/spec/js' do
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
      output = haml :'spec/js', :layout => false
      ABPlugin::Config.categories categories
      
      output
    end
  end
end