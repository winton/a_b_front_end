Application.class_eval do
  
  post '/sites/create.json' do
    ABPlugin::API.create_site(
      :name => params[:name],
      :token => current_user.single_access_token
    )
  end
end
