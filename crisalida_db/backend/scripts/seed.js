const { pool } = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Create test users
    const testUsers = [
      {
        user_id: uuidv4(),
        user_name: 'Laura Gómez',
        email: 'laura@example.com',
        phone: '3001234567',
        passwords: await bcrypt.hash('laura123', 10),
        rol: 'user',
        objetive: 'Quiero convertirme en desarrolladora web',
        preferred_language: 'es'
      },
      {
        user_id: uuidv4(),
        user_name: 'Carlos Rodríguez',
        email: 'carlos@example.com',
        phone: '3009876543',
        passwords: await bcrypt.hash('carlos123', 10),
        rol: 'admin',
        objetive: 'Enseñar programación a otros',
        preferred_language: 'es'
      }
    ];

    // Insert users
    for (const user of testUsers) {
      const query = `
        INSERT INTO users (user_id, user_name, email, phone, passwords, rol, objetive, preferred_language)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        user_name = VALUES(user_name),
        phone = VALUES(phone),
        passwords = VALUES(passwords),
        rol = VALUES(rol),
        objetive = VALUES(objetive),
        preferred_language = VALUES(preferred_language)
      `;
      
      await pool.execute(query, [
        user.user_id, user.user_name, user.email, user.phone,
        user.passwords, user.rol, user.objetive, user.preferred_language
      ]);
    }

    // Insert interests
    const interests = [
      { name: 'Programación Web' },
      { name: 'Inteligencia Artificial' },
      { name: 'Ciberseguridad' },
      { name: 'Desarrollo Móvil' },
      { name: 'DevOps' }
    ];

    for (const interest of interests) {
      const query = 'INSERT IGNORE INTO interests (name) VALUES (?)';
      await pool.execute(query, [interest.name]);
    }

    // Get interest IDs
    const [interestRows] = await pool.execute('SELECT interest_id, name FROM interests');
    const webDevInterest = interestRows.find(row => row.name === 'Programación Web');

    // Insert interest levels for Laura
    if (webDevInterest) {
      const query = `
        INSERT INTO interest_levels (user_id, interest_id, knowledge_level)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE knowledge_level = VALUES(knowledge_level)
      `;
      await pool.execute(query, [testUsers[0].user_id, webDevInterest.interest_id, 'principiante']);
    }

    // Insert user characterization
    const characterizationQuery = `
      INSERT INTO user_characterization (user_id, learning_goal, learning_pace)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
      learning_goal = VALUES(learning_goal),
      learning_pace = VALUES(learning_pace)
    `;
    await pool.execute(characterizationQuery, [
      testUsers[0].user_id,
      'Conseguir un empleo en desarrollo web en 6 meses',
      'equilibrado'
    ]);

    // Insert roadmaps
    const roadmapQuery = `
      INSERT INTO roadmaps (title, roadmap_description, topic, difficulty, estimated_time, user_id)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      title = VALUES(title),
      roadmap_description = VALUES(roadmap_description),
      topic = VALUES(topic),
      difficulty = VALUES(difficulty),
      estimated_time = VALUES(estimated_time)
    `;
    
    const roadmapData = [
      'Roadmap de Desarrollo Web',
      'Ruta de aprendizaje completa para front-end y back-end',
      'Programación Web',
      'beginner',
      180,
      testUsers[0].user_id
    ];
    
    const [roadmapResult] = await pool.execute(roadmapQuery, roadmapData);
    const roadmapId = roadmapResult.insertId || 1; // Use existing ID if already exists

    // Insert levels
    const levels = [
      {
        title: 'HTML & CSS Básico',
        description: 'Aprende a estructurar páginas web con HTML y darles estilo con CSS',
        order_number: 1,
        xp_reward: 100,
        status: 'unlocked'
      },
      {
        title: 'JavaScript Inicial',
        description: 'Primeros pasos con la programación web interactiva',
        order_number: 2,
        xp_reward: 150,
        status: 'locked'
      },
      {
        title: 'React Fundamentals',
        description: 'Introducción a React y componentes',
        order_number: 3,
        xp_reward: 200,
        status: 'locked'
      }
    ];

    for (const level of levels) {
      const levelQuery = `
        INSERT INTO levels (roadmap_id, title, description, order_number, xp_reward, status)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        description = VALUES(description),
        xp_reward = VALUES(xp_reward),
        status = VALUES(status)
      `;
      
      await pool.execute(levelQuery, [
        roadmapId, level.title, level.description,
        level.order_number, level.xp_reward, level.status
      ]);
    }

    // Get level IDs
    const [levelRows] = await pool.execute('SELECT level_id, order_number FROM levels WHERE roadmap_id = ? ORDER BY order_number', [roadmapId]);

    // Insert tasks
    const tasks = [
      {
        level_id: levelRows[0]?.level_id || 1,
        title: 'Leer introducción a HTML',
        description: 'Material básico sobre etiquetas HTML y estructura de documentos',
        type: 'reading',
        xp_reward: 50
      },
      {
        level_id: levelRows[0]?.level_id || 1,
        title: 'Practicar con CSS',
        description: 'Aplicar estilos a una página web simple',
        type: 'practice',
        xp_reward: 50
      },
      {
        level_id: levelRows[1]?.level_id || 2,
        title: 'Hacer un quiz de JavaScript',
        description: 'Preguntas básicas sobre variables, funciones y DOM',
        type: 'quiz',
        xp_reward: 75
      }
    ];

    for (const task of tasks) {
      const taskQuery = `
        INSERT INTO tasks (level_id, title, description, type, xp_reward, status)
        VALUES (?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        description = VALUES(description),
        type = VALUES(type),
        xp_reward = VALUES(xp_reward)
      `;
      
      await pool.execute(taskQuery, [
        task.level_id, task.title, task.description,
        task.type, task.xp_reward, 'pending'
      ]);
    }

    // Get task IDs
    const [taskRows] = await pool.execute('SELECT task_id FROM tasks ORDER BY task_id LIMIT 2');

    // Insert user tasks
    if (taskRows.length > 0) {
      const userTaskQuery = `
        INSERT INTO user_tasks (user_task_id, user_id, task_id, status, date_completed)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        status = VALUES(status),
        date_completed = VALUES(date_completed)
      `;
      
      await pool.execute(userTaskQuery, [
        uuidv4(), testUsers[0].user_id, taskRows[0].task_id, 'completed', new Date()
      ]);
      
      await pool.execute(userTaskQuery, [
        uuidv4(), testUsers[0].user_id, taskRows[1].task_id, 'in_progress', null
      ]);
    }

    // Insert triumphs
    const triumphs = [
      {
        title: 'Primer paso',
        description: 'Completaste tu primera tarea',
        icon: 'icon1.png',
        xp_required: 50,
        type_triumph: 'progress'
      },
      {
        title: 'Constancia',
        description: 'Completaste 5 días seguidos',
        icon: 'icon2.png',
        xp_required: 0,
        type_triumph: 'streak'
      }
    ];

    for (const triumph of triumphs) {
      const triumphQuery = `
        INSERT INTO triumphs (title, description, icon, xp_required, type_triumph)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        description = VALUES(description),
        icon = VALUES(icon),
        xp_required = VALUES(xp_required),
        type_triumph = VALUES(type_triumph)
      `;
      
      await pool.execute(triumphQuery, [
        triumph.title, triumph.description, triumph.icon,
        triumph.xp_required, triumph.type_triumph
      ]);
    }

    // Get triumph ID and assign to user
    const [triumphRows] = await pool.execute('SELECT triumph_id FROM triumphs LIMIT 1');
    if (triumphRows.length > 0) {
      const userTriumphQuery = `
        INSERT IGNORE INTO user_triumphs (user_id, triumph_id)
        VALUES (?, ?)
      `;
      await pool.execute(userTriumphQuery, [testUsers[0].user_id, triumphRows[0].triumph_id]);
    }

    // Insert streak
    const streakQuery = `
      INSERT INTO streaks (user_id, start_date, longest_streak_days, last_active_date, current_streak_days)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      longest_streak_days = VALUES(longest_streak_days),
      last_active_date = VALUES(last_active_date),
      current_streak_days = VALUES(current_streak_days)
    `;
    
    await pool.execute(streakQuery, [
      testUsers[0].user_id,
      new Date('2025-08-20'),
      3,
      new Date(),
      2
    ]);

    // Insert notes
    const noteQuery = `
      INSERT INTO notes (user_id, title, content)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
      title = VALUES(title),
      content = VALUES(content)
    `;
    
    await pool.execute(noteQuery, [
      testUsers[0].user_id,
      'Apuntes HTML',
      'Recordar que siempre se cierra la etiqueta <p> y usar semantic HTML'
    ]);

    // Insert resources
    const resourceQuery = `
      INSERT INTO resources (user_id, title, type, link, duration_minutes)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      title = VALUES(title),
      type = VALUES(type),
      link = VALUES(link),
      duration_minutes = VALUES(duration_minutes)
    `;
    
    await pool.execute(resourceQuery, [
      testUsers[0].user_id,
      'Curso HTML en YouTube',
      'video',
      'https://youtube.com/cursohtml',
      45
    ]);

    console.log('✅ Database seeded successfully!');
    console.log('\n📋 Test Data Summary:');
    console.log(`👤 Users created: ${testUsers.length}`);
    console.log(`🎯 Interests: ${interests.length}`);
    console.log(`🗺️  Roadmaps: 1`);
    console.log(`📚 Levels: ${levels.length}`);
    console.log(`✅ Tasks: ${tasks.length}`);
    console.log(`🏆 Triumphs: ${triumphs.length}`);
    console.log('\n🔑 Test Credentials:');
    console.log('Email: laura@example.com | Password: laura123');
    console.log('Email: carlos@example.com | Password: carlos123 (Admin)');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await pool.end();
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('🎉 Seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedDatabase };
