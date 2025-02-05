# 🏥 Goldenfold - Gestió Hospitalària
Un sistema de gestió hospitalària basat en Angular i .NET per millorar l'administració de pacients, consultes i recursos hospitalaris.

![image](https://github.com/user-attachments/assets/95cb86ac-d0d7-4aec-998f-3e8000ab796c)
![image](https://github.com/user-attachments/assets/b0325172-6370-4ce3-97bf-47b8b5b9a073)
![image](https://github.com/user-attachments/assets/90ab947c-b869-44ba-aefe-5772e68e2502)


---

## 📌 Característiques principals

- **Frontend en Angular** per a una interfície moderna i intuïtiva.
- **Backend en .NET Core** amb una API REST robusta.
- **Autenticació i autorització** amb **Keycloak**.
- **Base de dades MariaDB** per a la gestió d'informació mèdica.
- **Gestió de pacients**, historial mèdic i cites mèdiques.
- **Control de llits hospitalaris**, ingressos i altes.
- **Dashboard d'administració** amb permisos per rols: **Mèdics, Administratius i Control de Llits**.

---

## 🚀 Com iniciar el projecte?

### 1️⃣ Clonar el repositori
```sh
git clone https://github.com/alexgpareja/Goldenfold.git
cd Goldenfold
```

### 2️⃣ Configurar el Backend (API en .NET)
```sh
cd HospitalAPI
dotnet restore
dotnet build
dotnet run
```
L'API estarà disponible a `http://localhost:5000`.

> **Nota:** Configura la connexió a la base de dades editant `appsettings.json`.

### 3️⃣ Configurar el Frontend (Angular)
```sh
cd ClientApp
npm install
ng serve
```
L'aplicació estarà disponible a `http://localhost:4200`.

---

## ⚙️ Estructura del projecte

```
Goldenfold/
│── HospitalAPI/          # Backend en .NET Core
│   ├── Controllers/      # Controladors d'API REST
│   ├── DTO/             # Models DTO per la API
│   ├── Migrations/      # Migracions de Base de Dades
│   ├── Services/        # Serveis per accés a dades
│   ├── Models/          # Models de Base de Dades
│── ClientApp/           # Frontend en Angular
│   ├── src/app/         # Codi principal de l'aplicació
│   │   ├── administrador-sistema/
│   │   ├── administrativo/
│   │   ├── medico/
│   │   ├── controlador-camas/
│   │   ├── shared/      # Components compartits
│   │   ├── services/    # API Services
│   ├── package.json     # Dependències de Node.js
│── README.md            # Documentació
```

---

## 🔐 Autenticació i Seguretat
El sistema utilitza **Keycloak** per gestionar la seguretat dels usuaris i l'autenticació. Per configurar-ho, edita:

```ts
this.keycloak.init({
    config: {
      url: 'https://login.oscarrovira.com',
      realm: 'GoGoTron',
      clientId: 'goldenfold-frontend'
    },
    initOptions: {
      onLoad: 'login-required',
      checkLoginIframe: false
    }
});
```

---

## 🛠 Tecnologies Utilitzades

| Tecnologia         | Descripció |
|-------------------|------------|
| **Angular**       | Framework de frontend |
| **.NET Core**     | Backend API |
| **MariaDB**       | Base de dades |
| **Keycloak**      | Autenticació i autorització |
| **Docker**        | Contenidors per desplegament |

---

## 📄 Llicència
Aquest projecte està sota la llicència **MIT**.

📌 *Si tens preguntes, obre un issue o contacta amb nosaltres!* 🚀

