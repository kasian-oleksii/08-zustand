import css from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={css.footer}>
      <div className={css.content}>
        <p>© {new Date().getFullYear()} NoteHub. All rights reserved.</p>
        <div className={css.wrap}>
          <p>
            Developer:{' '}
            <a
              href="https://www.linkedin.com/in/volodymyr-vasyliev-dev/"
              target="_blank"
            >
              Volodymyr Vasyliev
            </a>{' '}
          </p>
          <p>
            Contact us:{' '}
            <a href="mailto:vasyliev.official@gmail.com">
              vasyliev.official@gmail.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
