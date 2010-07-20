Application.class_eval do
  
  get '/spec' do
    if current_user && current_user.admin?
      haml :spec
    else
      nil
    end
  end
end