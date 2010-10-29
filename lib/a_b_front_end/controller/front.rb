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
      @sites.sort! { |a, b| a["name"] <=> b["name"] }
      @sites.each do |site|
        site["categories"].sort! { |a, b| a["name"] <=> b["name"] }
        site["envs"].sort! { |a, b| a["name"] <=> b["name"] }
        site["categories"].each do |category|
          category["tests"].reverse!
        end
      end
      haml :dashboard
    else
      haml :front
    end
  end
end