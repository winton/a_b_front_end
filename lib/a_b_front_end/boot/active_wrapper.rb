require 'active_wrapper'

Application.class_eval do
  
  $db, $log, $mail = ActiveWrapper.setup(
    :base => root,
    :env => environment,
    :stdout => $0 != 'irb' && environment != :test
  )
  
  ActiveRecord::Base.include_root_in_json = false
  
  $db.establish_connection
end