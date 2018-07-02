Rails.application.routes.draw do
  root "candidates#new"
  resources :candidates, only: [ :create, :new, :show ]
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
