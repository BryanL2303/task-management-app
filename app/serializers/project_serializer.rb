class ProjectSerializer
  include FastJsonapi::ObjectSerializer
  attributes :project_name, :project_description, :tag

  has_many[:tasks]
end
