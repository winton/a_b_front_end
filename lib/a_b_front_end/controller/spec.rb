Application.class_eval do
  
  if environment == :development
    
    get '/spec/fake_data' do
      response.delete_cookie('a_b')
      response.delete_cookie('a_b_i')
      
      if request.cookies['category_name'] && request.cookies['site_name'] && request.cookies['test_name']
        categories = AB::Config.categories
        site = AB.site request.cookies['site_name']
        if site != false
          @category = request.cookies['category_name']
          @test = request.cookies['test_name']
          AB::Config.categories site['categories']
        end
        response.delete_cookie('category_name')
        response.delete_cookie('site_name')
        response.delete_cookie('test_name')
      end
      
      output = haml :'spec/fake_data', :layout => false
      AB::Config.categories categories
      
      output
    end
    
    get '/spec/js' do
      categories = AB::Config.categories
      AB::Config.categories [
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
      
      AB::API.spec_js_setup
      output = haml :'spec/js', :layout => false
      AB::Config.categories categories
      
      output
    end
  end
end