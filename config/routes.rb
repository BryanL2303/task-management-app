Rails.application.routes.draw do
  root "pages#index"

  namespace :api do
    resources :account do 
      member do
        get '/projects' => 'account#getProjects'
        get '/getUnscheduledTasks' => 'account#getUnscheduledTasks'
        get '/getTasksByDate/:calender_id' => 'account#getTasksByDate'
        get '/getTasksByProject/:project_id' => 'account#getTasksByProject'
        post '/checkNameExistence' => 'account#checkNameExistence'
        post '/createAccount' => 'account#createAccount'
        post '/authenticateAccount' => 'account#authenticateAccount'
      end
    end

    resources :calender, param: :date do
      member do
        post '/set_week_dates' => 'calender#set_week_dates'
      end
    end

    resources :project do
      member do
        post '/create_project' => 'project#create_project'
        post '/set_description' => 'project#set_description'
        post '/setTag' => 'project#setTag'
      end
    end

    resources :task do 
      member do
        post '/create_task' => 'task#create_task'
        post '/set_description' => 'task#set_description'
        post '/set_completed' => 'task#set_completed'
        post '/set_time' => 'task#set_time'
        post '/set_name' => 'task#set_name'
        post '/set_priority' => 'task#set_priority'
        post '/reschedule_task' => 'task#reschedule_task'
      end
    end
  end

  get '*path', to: 'pages#index', via: :all
end
