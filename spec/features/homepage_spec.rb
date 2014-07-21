require 'rails_helper'

feature 'homepage' do

  scenario 'User can see the app name on the homepage' do
    visit root_path
    expect(page).to have_content 'WorldMap'
  end
end