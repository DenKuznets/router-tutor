import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Root, {
  loader as rootLoader,
  action as rootAction,
} from "./routes/root";
import ErrorPage from "./error-page";
import Contact, {
  loader as contactLoader,
  action as contactAction,
} from "./routes/contact";
import EditContact, { action as editAction } from "./routes/edit";
import { action as destroyAction } from "./routes/destroy";

// Index - дефолтная страница при открытии приложения
import Index from "./routes";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />, //страница отображающаяся при ошибках
    loader: rootLoader, //загрузка данных, rootLoader мы написали сами (см ./routes/root), это не какаято готовая функция из библиотеки
    action: rootAction, //rootAction в данном примере эмулирует создание нового контакта через запрос с сервера. Она добавляет новйы контакт в список контактов (см. createContact в contacts.js) из которых мы потом создаем ul li список в root.jsx
    children: [ //children обернуты в другой children без path, который создан для перехвата ошибок и отображения их внутри корневого элемента, вместо того что бы показывать страницу на полное окно
      {
        errorElement:<ErrorPage />,
        children: [
          //что бы по нажатию ссылки новый элемент открывался на той же странице, нужно этот элемент помещать в children, а в jsx добавить <Outlet /> элемент в то место, где мы хотим видеть дочерний элемент
          {
            index: true, //вместо path у индекса просто index: true
            element: <Index />,
          },
          {
            path: "contacts/:contactId", //: двоеточие означает динамический сегмент ссылки, он называется URL Params, в данном примере передаются загрузчику (loader) в качестве params.contactId
            element: <Contact />,
            loader: contactLoader, //эмулирует загрузку контакта с сервера
            action: contactAction,
          },
          {
            path: "contacts/:contactId/edit",
            element: <EditContact />,
            loader: contactLoader, //используется тот же загрузчик что и у контакта только в этом туториале, обычно у каждого элемента свой загрузчик
            action: editAction,
          },
          {
            path: "contacts/:contactId/destroy",
            action: destroyAction,
            errorElement: <div>Oops! There was an error.</div>, //если при удалении элемента возникнет ошибка, она отобразится как дочерний элемент, а не как отдельная страница
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
