class CreateCandidates < ActiveRecord::Migration[5.1]
  def change
    create_table :candidates do |t|
      t.text :name
      t.string :email
      t.text :circle_problem_js_fiddle_link
      t.text :parent_child_problem_js_fiddle_link

      t.timestamps
    end
  end
end
