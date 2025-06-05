#!/usr/bin/env node

/**
 * Script de verificación para Familia Tareas App
 * Verifica que todo esté configurado correctamente antes del deploy
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Verificando configuración de Familia Tareas App...\n');

const checks = [];

// Verificar archivos esenciales
const essentialFiles = [
  'package.json',
  'vite.config.ts',
  'index.html',
  '.gitignore',
  'vercel.json',
  'src/App.tsx',
  'src/main.tsx',
  'src/context/AppContext.tsx'
];

console.log('📁 Verificando archivos esenciales...');
essentialFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  checks.push({ name: `Archivo ${file}`, passed: exists });
});

// Verificar package.json
console.log('\n📦 Verificando package.json...');
try {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  
  const packageChecks = [
    { name: 'Nombre del proyecto', passed: packageJson.name === 'familia-tareas-app' },
    { name: 'Script de build', passed: !!packageJson.scripts?.build },
    { name: 'Script de dev', passed: !!packageJson.scripts?.dev },
    { name: 'Dependencia React', passed: !!packageJson.dependencies?.react },
    { name: 'Dependencia Vite', passed: !!packageJson.devDependencies?.vite }
  ];
  
  packageChecks.forEach(check => {
    console.log(`  ${check.passed ? '✅' : '❌'} ${check.name}`);
    checks.push(check);
  });
} catch (error) {
  console.log('  ❌ Error leyendo package.json');
  checks.push({ name: 'package.json válido', passed: false });
}

// Verificar estructura de src/
console.log('\n📂 Verificando estructura del código fuente...');
const srcStructure = [
  'src/components',
  'src/context',
  'src/types',
  'src/lib',
  'src/hooks'
];

srcStructure.forEach(dir => {
  const exists = fs.existsSync(path.join(__dirname, dir));
  console.log(`  ${exists ? '✅' : '❌'} ${dir}/`);
  checks.push({ name: `Directorio ${dir}`, passed: exists });
});

// Verificar documentación
console.log('\n📚 Verificando documentación...');
const docFiles = [
  'README.md',
  'docs/vercel-deployment-guide.md',
  'docs/development-workflow.md',
  'docs/quick-start.md',
  'INSTRUCCIONES-USUARIO.md'
];

docFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  checks.push({ name: `Documentación ${file}`, passed: exists });
});

// Verificar configuración de Vercel
console.log('\n🚀 Verificando configuración de Vercel...');
try {
  const vercelConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'vercel.json'), 'utf8'));
  const hasRewrites = vercelConfig.rewrites && vercelConfig.rewrites.length > 0;
  console.log(`  ${hasRewrites ? '✅' : '❌'} Configuración de rewrites para SPA`);
  checks.push({ name: 'Configuración Vercel', passed: hasRewrites });
} catch (error) {
  console.log('  ❌ Error leyendo vercel.json');
  checks.push({ name: 'Configuración Vercel', passed: false });
}

// Resumen final
console.log('\n📊 RESUMEN DE VERIFICACIÓN');
console.log('========================');

const passed = checks.filter(check => check.passed).length;
const total = checks.length;
const percentage = Math.round((passed / total) * 100);

console.log(`\n✅ Verificaciones pasadas: ${passed}/${total} (${percentage}%)`);

if (percentage === 100) {
  console.log('\n🎉 ¡PERFECTO! Todo está configurado correctamente.');
  console.log('📋 Próximos pasos:');
  console.log('   1. Crear repositorio en GitHub');
  console.log('   2. Subir este código');
  console.log('   3. Conectar con Vercel');
  console.log('   4. ¡Deploy automático!');
  console.log('\n📖 Lee INSTRUCCIONES-USUARIO.md para pasos detallados.');
} else if (percentage >= 90) {
  console.log('\n⚠️  Casi listo. Hay algunas verificaciones menores que fallaron.');
  console.log('   Probablemente aún puedas hacer deploy exitosamente.');
} else {
  console.log('\n❌ Hay problemas que deben solucionarse antes del deploy.');
  console.log('\nVerificaciones fallidas:');
  checks
    .filter(check => !check.passed)
    .forEach(check => console.log(`   • ${check.name}`));
}

console.log('\n🔗 Enlaces útiles:');
console.log('   • GitHub: https://github.com');
console.log('   • Vercel: https://vercel.com');
console.log('   • Documentación: ./docs/');

process.exit(percentage === 100 ? 0 : 1);
