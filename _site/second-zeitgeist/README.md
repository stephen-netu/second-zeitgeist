# Letter of Values

This repository contains a Jekyll-based website for hosting our organization's Letter of Values - a transparent statement of our core principles and commitments.

## Purpose

The Letter of Values serves as a living document that:
- Clearly articulates our organizational values
- Provides transparency about our guiding principles
- Tracks the evolution of our values over time
- Creates accountability for our decisions and actions

## Technical Overview

This site is built with [Jekyll](https://jekyllrb.com/), a static site generator. Key features include:

- Responsive design for all devices
- Quote carousel showcasing value-related perspectives
- Changelog to track the evolution of our values
- Optional timeline visualization

## Local Development

### Prerequisites
- Ruby 2.5.0 or higher
- RubyGems
- GCC and Make

### Setup
1. Clone this repository
2. Install Jekyll and Bundler: `gem install jekyll bundler`
3. Navigate to the project directory and run: `bundle install`
4. Start the local server: `bundle exec jekyll serve`
5. Visit `http://localhost:4000` in your browser

## Customization

- **Content**: Edit `index.md` to update the main letter content
- **Quotes**: Modify `_includes/quote-carousel.html` to update the quotes
- **Styling**: Customize `assets/css/style.css` for visual changes
- **Change History**: Update `_data/changelog.yml` to reflect value evolution

## Deployment

This site can be deployed to any static hosting service:
- GitHub Pages
- Netlify
- Vercel
- Any standard web hosting

## Contributing

We welcome contributions to improve the letter or its presentation. Please submit a pull request with your proposed changes.

## License

This project is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT). 