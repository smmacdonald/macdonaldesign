<?php

namespace Drupal\twig_vardumper;

use Twig\Environment;
use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;

/**
 * Twig extension with some useful functions and filters.
 */
class TwigExtension extends AbstractExtension {

  /**
   * {@inheritdoc}
   */
  public function getFunctions() {
    // The dump is safe if var_dump is overridden by xdebug.
    $isDumpOutputHtmlSafe = \extension_loaded('xdebug')
      // The false means that it was not set (and the default is on) or it
      // explicitly enabled.
      && (FALSE === ini_get('xdebug.overload_var_dump') || ini_get('xdebug.overload_var_dump'))
      // The false means that it was not set (and the default is on) or it
      // explicitly enabled xdebug.overload_var_dump produces HTML only when
      // html_errors is also enabled.
      && (FALSE === ini_get('html_errors') || ini_get('html_errors'))
      || 'cli' === \PHP_SAPI;

    return [
      new TwigFunction('dump', [$this, 'drupalDump'], [
        'is_safe' => $isDumpOutputHtmlSafe ? ['html'] : [],
        'needs_context' => TRUE,
        'needs_environment' => TRUE,
        'is_variadic' => TRUE,
      ]),
      new TwigFunction('vardumper', [$this, 'drupalDump'], [
        'is_safe' => $isDumpOutputHtmlSafe ? ['html'] : [],
        'needs_context' => TRUE,
        'needs_environment' => TRUE,
        'is_variadic' => TRUE,
      ]),
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getName() {
    return 'twig_vardumper';
  }

  /**
   * Dumps information about variables.
   *
   * @param \Twig\Environment $env
   *   Enviroment values.
   * @param array $context
   *   Context values.
   * @param array $args
   *   Variables.
   *
   * @return false|string|void
   */
  public function drupalDump(Environment $env, array $context, array $args = []) {

    if (!$env->isDebug()) {
      return;
    }

    ob_start();
    $var_dumper = '\Symfony\Component\VarDumper\VarDumper';
    if (class_exists($var_dumper)) {
      if (!empty($args)) {
        foreach ($args as $arg) {
          call_user_func($var_dumper . '::dump', $arg);
        }
      }
      else {
        call_user_func($var_dumper . '::dump', $context);
      }
      return ob_get_clean();
    }
    else {
      trigger_error('Could not dump the variable because symfony/var-dumper component is not installed.', E_USER_WARNING);
    }
  }

}
