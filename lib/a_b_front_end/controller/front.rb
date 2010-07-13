Application.class_eval do
  
  get '/' do
    if current_user
      @sites = ABPlugin::API.sites(
        :include => { :envs => true, :categories => { :include => :tests } },
        :token => current_user.single_access_token
      )
      haml :dashboard
    else
      haml :front
    end
  end
end