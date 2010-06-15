Application.class_eval do

  post '/sessions/create' do
    @user_session = UserSession.new(params[:session])
    @user_session.save
    redirect '/'
  end
  
  get '/sessions/destroy' do
    current_user_session.destroy
    redirect '/'
  end
end