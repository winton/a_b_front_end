class User < ActiveRecord::Base
  
  acts_as_authentic
  
  validates_confirmation_of :password, :on => :create
  validates_format_of :email, :with => /^([\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+\.)*[\w\!\#$\%\&\'\*\+\-\/\=\?\^\`{\|\}\~]+@((((([a-z0-9]{1}[a-z0-9\-]{0,62}[a-z0-9]{1})|[a-z])\.)+[a-z]{2,6})|(\d{1,3}\.){3}\d{1,3}(\:\d{1,5})?)$/i
  validates_presence_of :email
  validates_presence_of :password, :on => :create
  
  def self.quick_create(u, p)
    user = self.create(:login => u, :password => p, :password_confirmation => p)
    puts "\nCouldn't save user:\n#{user.errors.to_a.inspect}\n\n" unless user.id
    user
  end
end