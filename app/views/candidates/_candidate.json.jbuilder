json.extract! candidate, :id, :name, :email, :circle_problem_js_fiddle_link, :parent_child_problem_js_fiddle_link, :created_at, :updated_at
json.url candidate_url(candidate, format: :json)
