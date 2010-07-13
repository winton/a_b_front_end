Application.class_eval do

  Dir["#{root}/lib/a_b_front_end/controller/*.rb"].sort.each do |path|
    require path
  end
end