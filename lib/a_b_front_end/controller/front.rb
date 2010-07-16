Application.class_eval do
  
  get '/' do
    if current_user
      @sites = ABPlugin::API.sites(
        :include => {
          :envs => true,
          :categories => {
            :include => {
              :tests => {
                :include => {
                  :variants => {
                    :methods => :for_dashboard
                  }
                }
              }
            }
          }
        },
        :token => current_user.single_access_token
      )
      haml :dashboard
    else
      haml :front
    end
  end
end