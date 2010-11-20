class AB
  module Helper
    
    private
    
    def a_b(category=nil, test=nil, extra=nil)
      @a_b ||= AB.new(self)
      
      if category || test || extra
        @a_b.test(category, test, extra)
      
      else
        @a_b.javascript
      end
    end
  end
end