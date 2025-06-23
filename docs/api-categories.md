# Categories API Documentation

## Base URL
```
/api/categories
```

## Authentication
Semua endpoint kecuali GET memerlukan authentication (user harus login).

## Endpoints

### 1. Get All Categories
```http
GET /api/categories
```

**Response:**
```json
[
  {
    "id": "string",
    "name": "string",
    "slug": "string",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### 2. Create Category
```http
POST /api/categories
Authorization: Required
```

**Request Body:**
```json
{
  "name": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "slug": "string",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### 3. Get Category by ID
```http
GET /api/categories/{id}
```

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "slug": "string",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### 4. Update Category
```http
PUT /api/categories/{id}
Authorization: Required
```

**Request Body:**
```json
{
  "name": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "slug": "string",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### 5. Delete Category
```http
DELETE /api/categories/{id}
Authorization: Required
```

**Response:**
```json
{
  "message": "Kategori berhasil dihapus"
}
```

### 6. Get Category by Slug (with Posts & Projects)
```http
GET /api/categories/slug/{slug}
```

**Response:**
```json
{
  "id": "string",
  "name": "string",
  "slug": "string",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "posts": [
    {
      "id": "string",
      "title": "string",
      "slug": "string",
      "published": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "projects": [
    {
      "id": "string",
      "title": "string",
      "slug": "string",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Nama kategori diperlukan"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "error": "Kategori tidak ditemukan"
}
```

### 500 Internal Server Error
```json
{
  "error": "Gagal mengambil data kategori"
}
```

## Slug Generation
- Slug otomatis dibuat dari nama kategori
- Menggunakan library `slugify` dengan locale Indonesia
- Format: lowercase, tanpa karakter khusus
- Contoh: "Teknologi Web" → "teknologi-web"

## Validation Rules
1. Nama kategori tidak boleh kosong
2. Slug harus unik
3. Kategori tidak bisa dihapus jika masih digunakan oleh post/project
4. Semua operasi CRUD (kecuali GET) memerlukan authentication 