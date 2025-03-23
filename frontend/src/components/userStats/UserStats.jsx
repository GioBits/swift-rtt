import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import StatsService from '../../service/statsService';

const mockUserStats = {
  score: { score: 100.0 },
  totalAudios: 150,
  totalLogins: 45,
  lastLogin: "2024-03-20T15:30:00"
};

const UserStats = ({ userId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        
        const userStats = await StatsService.getUserStats(userId);
        setStats(userStats);
      
      } catch (error) {
        console.error('Error fetching user stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cerulean"></div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Nunca';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg shadow-blueMetal/40">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-cerulean mb-6">
          Tus Estadísticas
        </h2>
        
        <div className="flex flex-col space-y-4">
          {/* Puntuación */}
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <div>
              <p className="text-sm text-gray-600">
                Puntuación Total
              </p>
              <p className="text-xl font-bold text-cerulean">
                {stats?.score?.score * 100 || 0}
              </p>
            </div>
          </div>

          {/* Total de Audios */}
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
            <div>
              <p className="text-sm text-gray-600">
                Audios Procesados
              </p>
              <p className="text-xl font-bold text-cerulean">
                {stats?.totalAudios || 0}
              </p>
            </div>
          </div>

          {/* Total de Inicios de Sesión */}
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm text-gray-600">
                Inicios de Sesión
              </p>
              <p className="text-xl font-bold text-cerulean">
                {stats?.totalLogins || 0}
              </p>
            </div>
          </div>

          {/* Último Inicio de Sesión */}
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <svg className="w-8 h-8 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm text-gray-600">
                Último Acceso
              </p>
              <p className="text-xl font-bold text-cerulean">
                {formatDate(stats?.lastLogin)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

UserStats.propTypes = {
  userId: PropTypes.number.isRequired
};

export default UserStats; 