// Outlet - что-то типа iframe, позволяет показывать элемент с другой ссылки (path, route) внутри другого элемента
// Link - замена <a /> (дефолтной якорной ссылки) , что бы осуществлять переход по ссылкам на стороне клиента, а не с сервера
//  useLoaderData() - хук, возвращает данные переданные роутеру пользовательской функцией loader указанной в router.loader
// Form замена <form />
// NavLink - ссылка получающая props active и pending, active - когда ссылка активна, pending - когда собирается стать активной (данные еще подгружаются)
// useNavigation - возвращает текущее состояние навигации: 'idle' | 'submitting' | 'loading'
import { useEffect } from "react";
import {
  Outlet,
  NavLink,
  useLoaderData,
  Form,
  redirect,
  useNavigation,
  useSubmit,
} from "react-router-dom";
import { getContacts, createContact } from "../contacts";

// функция асинхронная что бы эмулировать запросы данных с сервера
export async function action() {
  const contact = await createContact();
  return redirect(`/contacts/${contact.id}/edit`);
}

// функция асинхронная что бы эмулировать запросы данных с сервера
// мы запросили контакты с "сервера", и отправили их в загрузчик роутера loader: rootLoader, затем получили их оттуда с помощью функции useLoaderData() (см. код ниже в функции Root())
export async function loader({ request }) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getContacts(q);
  return { contacts, q };
}

export default function Root() {
  const { contacts, q } = useLoaderData();
  const navigation = useNavigation();
  const submit = useSubmit();

  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has("q");

  useEffect(() => {
    document.getElementById("q").value = q;
  }, [q]);
  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <Form id="search-form" role="search">
            <input
              id="q"
              className={searching ? 'loading' : ''}
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
              defaultValue={q}
              // фильтрация элементов списка сразу при введении текста в search без нажатия enter
              onChange={(event) => {
                submit(event.currentTarget.form);
              }}
            />
            {/* спиннер будет показываться если идет поиск */}
            <div id="search-spinner" aria-hidden hidden={!searching} />
            <div className="sr-only" aria-live="polite"></div>
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  {/* ссылка соответсвтует path указанному в main.jsx у элемента Contact  */}
                  <NavLink
                    to={`contacts/${contact.id}`}
                    className={({ isActive, isPending }) =>
                      isActive ? "active" : isPending ? "pending" : ""
                    }
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div
        id="detail"
        className={navigation.state === "loading" ? "loading" : ""}
      >
        <Outlet />
      </div>
    </>
  );
}
