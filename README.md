# Second Zeitgeist Manifesto

A modern, responsive website for the Second Zeitgeist Manifesto with dark mode support and improved UI elements.

## Features

- **Dark Mode**: Toggle between light and dark themes with a persistent preference
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Quote Carousel**: Animated carousel with navigation indicators
- **Timeline View**: Interactive timeline display
- **Improved Typography**: Better readability and text spacing
- **Print Optimization**: Properly formatted for print output
- **Modern Aesthetics**: Clean, modern UI with consistent spacing

## Development

This site is built with Jekyll. To run it locally:

1. Install Ruby and Jekyll
2. Clone this repository
3. Run `bundle install` to install dependencies
4. Run `bundle exec jekyll serve` to start the local server
5. Visit `http://localhost:4000` in your browser

## Customization

### Adding New Quotes

Edit `_data/quotes.yml` to add or modify quotes in the carousel. The include `/_includes/quote-carousel.html` renders from this data.

### Modifying Styles

- Single source of truth: `assets/css/style.scss` (compiled by Jekyll to `style.css`)

### Timeline

Interactive timeline uses KnightLab (Google Sheet). The native, filterable timeline renders from `_data/epistemology.yml` (falls back to `_data/timeline.yml`).

## License

This project is open source and available under [LICENSE]. 