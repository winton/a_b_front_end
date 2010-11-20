Application.class_eval do
  
  post '/users' do
    @user = User.create(params[:user])
    if @user.id
      AB::API.create_user(
        :identifier => @user.id,
        :token => @user.single_access_token
      )
      redirect '/'
    else
      haml :front
    end
  end
end