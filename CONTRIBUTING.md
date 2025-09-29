# 🤝 Contributing to Weqaya Cafe Buddy

Thank you for your interest in contributing to Weqaya Cafe Buddy! This document provides guidelines and information for contributors.

## 📋 **Table of Contents**

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contributing Guidelines](#contributing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Performance Guidelines](#performance-guidelines)

## 📜 **Code of Conduct**

This project adheres to a code of conduct that we expect all contributors to follow. Please be respectful, inclusive, and constructive in all interactions.

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js 18 or higher
- npm or yarn package manager
- Git
- Basic knowledge of React, TypeScript, and modern web development

### **Fork and Clone**
```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/Weqayaa.git
cd Weqayaa

# Add the original repository as upstream
git remote add upstream https://github.com/zeiado/Weqayaa.git
```

## 🛠️ **Development Setup**

### **Install Dependencies**
```bash
npm install
```

### **Environment Configuration**
```bash
# Copy the example environment file
cp .env.example .env.local

# Edit the environment variables as needed
```

### **Start Development Server**
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## 📝 **Contributing Guidelines**

### **Types of Contributions**
- 🐛 **Bug Fixes** - Fix existing issues
- ✨ **New Features** - Add new functionality
- 📚 **Documentation** - Improve docs and examples
- 🎨 **UI/UX Improvements** - Enhance user interface
- ⚡ **Performance** - Optimize speed and efficiency
- 🧪 **Tests** - Add or improve test coverage

### **Before You Start**
1. Check existing [issues](https://github.com/zeiado/Weqayaa/issues) to avoid duplicates
2. For major changes, open an issue first to discuss the approach
3. Ensure your changes align with the project's goals

## 🔄 **Pull Request Process**

### **1. Create a Feature Branch**
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

### **2. Make Your Changes**
- Write clean, readable code
- Follow the existing code style
- Add comments for complex logic
- Update documentation if needed

### **3. Test Your Changes**
```bash
# Run the development server
npm run dev

# Run linting
npm run lint

# Build the project
npm run build
```

### **4. Commit Your Changes**
```bash
git add .
git commit -m "feat: add new feature description"
```

**Commit Message Format:**
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding or updating tests

### **5. Push and Create PR**
```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub with:
- Clear title and description
- Reference any related issues
- Screenshots for UI changes
- Testing instructions

## 📏 **Code Standards**

### **TypeScript**
- Use strict TypeScript configuration
- Define proper interfaces and types
- Avoid `any` type when possible
- Use meaningful variable and function names

### **React Best Practices**
- Use functional components with hooks
- Implement proper error boundaries
- Optimize with React.memo, useMemo, useCallback when appropriate
- Follow the component composition pattern

### **Styling**
- Use Tailwind CSS utility classes
- Follow the existing design system
- Ensure responsive design
- Maintain consistent spacing and typography

### **File Organization**
```
src/
├── components/          # Reusable components
│   ├── ui/             # Base UI components
│   └── feature/        # Feature-specific components
├── pages/              # Route components
├── services/           # API and business logic
├── types/              # TypeScript definitions
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── assets/             # Static assets
```

## 🧪 **Testing**

### **Manual Testing**
- Test on different screen sizes
- Verify functionality across browsers
- Check accessibility features
- Test performance impact

### **Performance Testing**
```bash
# Build and analyze bundle size
npm run build

# Check for performance regressions
npm run analyze
```

## ⚡ **Performance Guidelines**

### **Bundle Size**
- Keep individual chunks under 500KB
- Use dynamic imports for large components
- Optimize images (WebP format preferred)
- Remove unused dependencies

### **Runtime Performance**
- Use React.memo for expensive components
- Implement proper loading states
- Optimize API calls with caching
- Minimize re-renders

### **Code Splitting**
```typescript
// Use lazy loading for route components
const Dashboard = lazy(() => import("@/components/Dashboard"));
```

## 🐛 **Bug Reports**

When reporting bugs, please include:

1. **Clear Description** - What happened vs. what you expected
2. **Steps to Reproduce** - Detailed reproduction steps
3. **Environment** - Browser, OS, device information
4. **Screenshots** - Visual evidence if applicable
5. **Console Logs** - Any error messages or warnings

## ✨ **Feature Requests**

For new features, please provide:

1. **Use Case** - Why is this feature needed?
2. **Proposed Solution** - How should it work?
3. **Alternatives** - Other approaches considered
4. **Additional Context** - Any other relevant information

## 📚 **Documentation**

### **Code Documentation**
- Add JSDoc comments for complex functions
- Document component props and usage
- Include examples for reusable components
- Update README for new features

### **API Documentation**
- Document new API endpoints
- Include request/response examples
- Specify error handling
- Update type definitions

## 🔍 **Review Process**

### **What We Look For**
- ✅ Code quality and readability
- ✅ Performance impact
- ✅ Accessibility compliance
- ✅ Mobile responsiveness
- ✅ Browser compatibility
- ✅ Security considerations

### **Review Timeline**
- Initial review within 48 hours
- Feedback and requested changes
- Final approval and merge
- Deployment to staging/production

## 🎉 **Recognition**

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- GitHub contributor statistics

## 📞 **Getting Help**

- 💬 **Discussions** - [GitHub Discussions](https://github.com/zeiado/Weqayaa/discussions)
- 🐛 **Issues** - [GitHub Issues](https://github.com/zeiado/Weqayaa/issues)
- 📧 **Email** - Contact the maintainers directly

## 🙏 **Thank You**

Thank you for contributing to Weqaya Cafe Buddy! Your contributions help make healthy campus dining more accessible and enjoyable for students everywhere.

---

**Happy Coding! 🚀**
