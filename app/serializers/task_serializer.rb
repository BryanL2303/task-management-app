class TaskSerializer
  include FastJsonapi::ObjectSerializer
  attributes :task_name, :task_description, :time, :scheduled, :calender_id, :project_id, :task_priority, :tag
end