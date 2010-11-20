Application.class_eval do
  
  delete '/categories.json' do
    AB::API.delete_category(
      :name => params[:name],
      :token => current_user.single_access_token
    ).to_json
  end
  
  post '/categories.json' do
    AB::API.create_category(
      :name => params[:name],
      :site_id => params[:site_id],
      :token => current_user.single_access_token
    ).to_json
  end
  
  put '/categories.json' do
    AB::API.update_category(
      :id => params[:id],
      :name => params[:name],
      :token => current_user.single_access_token
    ).to_json
  end
  
  delete '/envs.json' do
    AB::API.delete_env(
      :name => params[:name],
      :token => current_user.single_access_token
    ).to_json
  end
  
  post '/envs.json' do
    AB::API.create_env(
      :domains => params[:domains].select { |d| !d.empty? }.join(','),
      :name => params[:name],
      :site_id => params[:site_id],
      :token => current_user.single_access_token
    ).to_json
  end
  
  put '/envs.json' do
    AB::API.update_env(
      :domains => params[:domains].select { |d| !d.empty? }.join(','),
      :id => params[:id],
      :name => params[:name],
      :token => current_user.single_access_token
    ).to_json
  end
  
  delete '/sites.json' do
    AB::API.delete_site(
      :name => params[:name],
      :token => current_user.single_access_token
    ).to_json
  end
  
  post '/sites.json' do
    AB::API.create_site(
      :include => params[:include],
      :name => params[:name],
      :only => params[:only],
      :token => current_user.single_access_token
    ).to_json
  end
  
  put '/sites.json' do
    AB::API.update_site(
      :id => params[:id],
      :name => params[:name],
      :token => current_user.single_access_token
    ).to_json
  end
  
  delete '/tests.json' do
    AB::API.delete_test(
      :id => params[:id],
      :token => current_user.single_access_token
    ).to_json
  end
  
  post '/tests.json' do
    AB::API.create_test(
      :category => params[:category],
      :include => params[:include] || { 
        :variants => {
          :methods => :for_dashboard
        }
      },
      :name => params[:name],
      :only => params[:only],
      :token => current_user.single_access_token,
      :variants => params[:variants]
    ).to_json
  end
  
  put '/tests.json' do
    AB::API.update_test(
      :include => params[:include] || { 
        :variants => {
          :methods => :for_dashboard
        }
      },
      :id => params[:id],
      :name => params[:name],
      :old_variants => params[:old_variants],
      :only => params[:only],
      :token => current_user.single_access_token,
      :variants => params[:variants]
    ).to_json
  end
  
  get '/tests/:id/reset.json' do
    AB::API.reset_test(
      :id => params[:id],
      :include => params[:include] || { 
        :variants => {
          :methods => :for_dashboard
        }
      },
      :only => params[:only],
      :token => current_user.single_access_token
    ).to_json
  end
  
  get '/variants/:id/reset.json' do
    AB::API.reset_variant(
      :id => params[:id],
      :include => params[:include],
      :only => params[:only],
      :methods => params[:methods] || :for_dashboard,
      :token => current_user.single_access_token
    ).to_json
  end
end