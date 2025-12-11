import './MainLayout.scss';

function MainLayout() {
  return (
    <div className="container">
      <div className="wrapper">
        {/* TODO: Добавить Header Component */}
        <header className="header">Header</header>
        {/* Header Component */}

        <main className="main">
          {/* TODO: Добавить Sidebar Component */}
          <aside className="sidebar">Sidebar</aside>
          {/* Sidebar Component */}

          {/* TODO: Добавить CardList Component */}
          <section className="content">Content</section>
          {/* CardList Component */}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
