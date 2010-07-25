Application.class_eval do
  
  post '/categories.json' do
    ABPlugin::API.create_category(
      :name => params[:name],
      :site_id => params[:site_id],
      :token => current_user.single_access_token
    ).to_json
  end
  
  delete '/categories.json' do
    ABPlugin::API.delete_category(
      :name => params[:name],
      :token => current_user.single_access_token
    ).to_json
  end
  
  post '/envs.json' do
    ABPlugin::API.create_env(
      :name => params[:name],
      :site_id => params[:site_id],
      :token => current_user.single_access_token
    ).to_json
  end
  
  delete '/envs.json' do
    ABPlugin::API.delete_env(
      :name => params[:name],
      :token => current_user.single_access_token
    ).to_json
  end
  
  delete '/sites.json' do
    ABPlugin::API.delete_site(
      :name => params[:name],
      :token => current_user.single_access_token
    ).to_json
  end
  
  post '/sites.json' do
    ABPlugin::API.create_site(
      :include => params[:include],
      :name => params[:name],
      :only => params[:only],
      :token => current_user.single_access_token
    ).to_json
  end
  
  post '/tests.json' do
    ABPlugin::API.create_test(
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
  
  delete '/tests.json' do
    ABPlugin::API.delete_test(
      :category => params[:category],
      :name => params[:name],
      :token => current_user.single_access_token
    ).to_json
  end
end