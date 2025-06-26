# IIIF Image API Example - Requirements

## Project Overview
This project is a Vue 3 application that demonstrates the capabilities of the International Image Interoperability Framework (IIIF) Image API. It provides an interactive interface for users to explore and manipulate IIIF-compliant images using the standard parameters defined in the IIIF Image API specification.

## Functional Requirements

### Core Functionality
1. **IIIF Image Loading**
    - Load IIIF image manifests (info.json files) from URLs
    - Support for IIIF Image API versions 1.0, 2.0, and 3.0
    - Display error messages for invalid URLs or failed requests

2. **Image Manipulation**
    - Implement all standard IIIF Image API parameters:
        - Region: Select portions of the image (full, square, or specific coordinates)
        - Size: Resize the image with options to maintain aspect ratio
        - Rotation: Rotate the image by degrees (0-360)
        - Quality: Apply quality transformations (default, color, gray, bitonal, etc.)
        - Format: Convert to different formats (jpg, png, etc.)
    - Preview the manipulated image in real-time
    - Generate and display the corresponding IIIF URL for the manipulated image

3. **User Interface**
    - Provide an intuitive interface for adjusting image parameters
    - Display the original image information (from info.json)
    - Allow copying of generated IIIF URLs
    - Include example links to demonstrate different IIIF image sources

## Technical Requirements

### Development Environment
- **Framework**: Vue 3 with Composition API
- **Build Tool**: Vite
- **Language**: TypeScript
- **State Management**: Pinia
- **Routing**: Vue Router

### Code Organization
- Maintain clear separation of concerns between components and stores
- Implement utility functions (like debounce) in dedicated modules
- Follow Vue 3 best practices for component design and reactivity

### Performance
- Implement debouncing for user inputs to prevent excessive API calls
- Optimize image loading and rendering
- Handle large images efficiently

### Testing
- **Unit Testing**: Implement tests using Vitest and Vue Test Utils
- **End-to-End Testing**: Implement tests using Playwright
- Ensure test coverage for critical functionality

### Browser Compatibility
- Support modern browsers (Chrome, Firefox, Safari, Edge)
- Handle browser-specific image format limitations (e.g., TIFF not supported in browsers)

## IIIF Compliance Requirements

### API Support
- Correctly implement the IIIF Image API specification
- Support multiple versions of the IIIF Image API (1.0, 2.0, 3.0)
- Handle different IIIF server implementations and their variations

### Image Parameters
- **Region**: full, square, x,y,w,h, pct:x,y,w,h
- **Size**: full, max, w,h, pct:n, !w,h
- **Rotation**: n, !n (mirroring)
- **Quality**: default, color, gray, bitonal (and server-specific qualities)
- **Format**: jpg, png, gif, webp (and server-specific formats)

## User Experience Requirements
- Provide clear feedback for user actions
- Display appropriate error messages for invalid operations
- Implement responsive design for different screen sizes
- Include helpful examples and documentation within the interface

## Documentation Requirements
- Include comprehensive README with setup and usage instructions
- Document the IIIF Image API concepts and how they're implemented
- Provide examples of different parameter combinations and their effects
- Include references to the official IIIF documentation