class AB
  class Datastore
    
    def initialize(data, send)
      @data, @send = data, send
    end
    
    def get(key)
      @data[key] || (key == :e ? {} : [])
    end
    
    def set(key, value, extras=nil)
      return unless value
      @data[key] ||= []
      # Store current version for later comparison
      old = @data[key].dup
      # Hash
      if value.respond_to?(:keys)
        @data[key] = value
      # Array
      elsif value.respond_to?(:flatten)
        @data[key] += value
      # Other value
      else
        @data[key] << value
      end
      if @data[key].respond_to?(:uniq!)
        @data[key].uniq!
      end
      unless key == :e
        # Add difference to @send
        diff = @data[key] - old
        unless diff.empty?
          @send[key] ||= []
          @send[key] += diff
          @send[key].uniq!
          @send[:e] = extras unless extras.empty?
        end
      end
    end
  end
end