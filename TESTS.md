# TESTS.md

# Planned Testing Strategy

The current MVP does not yet include automated tests.

Planned testing stack:
- Jest
- Supertest
- React Testing Library

## Planned Tests

### 1. Team Size Downgrade Test
Checks whether unnecessary enterprise plans are detected.

### 2. Duplicate Tool Detection Test
Checks overlapping AI coding assistant recommendations.

### 3. Savings Calculation Test
Validates percentage-based savings estimation.

### 4. JWT Authentication Test
Validates protected route access.

### 5. Audit Storage API Test
Checks audit storage and UUID generation.

## Planned CI/CD

GitHub Actions workflow planned for:
- linting
- automated tests
- build verification
